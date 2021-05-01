import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from 'src/app/authentication/sign-up/password.validators';
import { UsernameValidators } from 'src/app/authentication/sign-up/username.validators';
import { LogService } from 'src/app/services/log.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/users.service';
import { patterns, UserTypes } from 'src/app/types/entity-types';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  public passwordForm = new FormGroup({
    oldPassword: new FormControl('', [ Validators.required ]),
    newPassword: new FormControl('', [
      Validators.pattern(patterns.password),
      Validators.required,
    ]),
  }, [ PasswordValidators.newPasswordShouldNotMatch ]);
  public processingEmail = false;
  public processingPassword = false;
  public form: FormGroup;

  constructor(
    public userService: UserService,
    private usernameValidators: UsernameValidators,
    private userAuthService: UserAuthService,
    private log: LogService,
  ) {}
  
  public buildForm(user: UserTypes.Self): FormGroup | Promise<FormGroup> {
    return new FormGroup({
      email: new FormControl(user.email, [
        Validators.pattern(patterns.email),
      ], [ this.usernameValidators.emailInUse.bind(this.usernameValidators) ]),
    });
  }

  public async ngOnInit() {
    await this.userService.init();

    this.form = await this.buildForm(this.userService.self);
  }

  public async changeEmail() {
    try {      
      if (this.form.invalid) return;      
  
      const email = this.form.get('email').value;
      this.processingEmail = await this.userAuthService.sendVerifyEmail(email);
      await this.log.success('Email sent.');
    } catch {
      this.passwordForm.setErrors({ invalidEmail: true }); 
      await this.log.error('Failed to send email.');     
    }
  }

  public async changePassword() {
    try {      
      if (this.passwordForm.invalid) return;
      if (!this.userService.self.verified)
        throw new TypeError('A verified email is needed to reset password.');
  
      const email = this.form.get('email').value;
      const oldPassword = this.passwordForm.get('oldPassword').value;
      const newPassword = this.passwordForm.get('newPassword').value;
      this.processingPassword = await this.userAuthService
        .changePassword(email, oldPassword, newPassword);

      await this.log.success('Password succesfully changed.');
    } catch (error) {
      await this.log.error(error.message);
      this.passwordForm.setErrors({ oldPasswordInvalid: true });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsernameValidators } from 'src/app/authentication/sign-up/username.validators';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UsersService } from 'src/app/services/users.service';
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
  });
  public processingEmail = false;
  public processingPassword = false;
  public form: FormGroup;

  constructor(
    public usersService: UsersService,
    private usernameValidators: UsernameValidators,
    private userAuthService: UserAuthService,
  ) {}
  
  public buildForm(user: UserTypes.Self): FormGroup | Promise<FormGroup> {
    return new FormGroup({
      email: new FormControl(user.email, [
        Validators.pattern(patterns.email),
      ], [ this.usernameValidators.emailInUse.bind(this.usernameValidators) ]),
    });
  }

  public async ngOnInit() {
    await this.usersService.init();

    this.form = await this.buildForm(this.usersService.user);
  }

  public async changeEmail() {
    try {      
      if (this.form.invalid) return;      
  
      const email = this.form.get('email').value;
      this.processingEmail = await this.userAuthService.sendVerifyEmail(email);
    } catch {
      this.passwordForm.setErrors({ invalidEmail: true });      
    }
  }

  public async changePassword() {
    try {      
      if (this.passwordForm.invalid) return;
  
      const oldPassword = this.passwordForm.get('oldPassword').value;
      const newPassword = this.passwordForm.get('newPassword').value;
      this.processingPassword = await this.userAuthService.changePassword(
        oldPassword,
        newPassword,
      );
    } catch {
      this.passwordForm.setErrors({ oldPasswordInvalid: true });
    }
  }
}

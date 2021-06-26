import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { patterns } from 'src/app/types/entity-types';
import { Credentials, UserAuthService } from '../../../services/api/user-auth.service';
import { PasswordValidators } from '../sign-up/password.validators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form = new FormGroup({
    code: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
    email: new FormControl('', [
      Validators.pattern(patterns.email),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(patterns.password),
    ]),
  });
  forgotPasswordSent = false;
  processing = false;
  shouldVerify = false;

  public get email() {
    return this.form.get('email');
  }
  public get password() {
    return this.form.get('password');
  }

  public get code() {
    return this.route.snapshot.queryParamMap.get('code');
  }
  public get redirect() {
    return this.route.snapshot.queryParamMap.get('redirect')
      ?? '/channels';
  }

  constructor(
    private auth: UserAuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public async ngOnInit() {
    if (this.code)
      await this.verify();
  }

  public async login() {
    const user: Credentials = this.form.value;    
    if (this.form.invalid) return;

    try {
      this.processing = true;
      const res = await this.auth.login(user);
      if (res.verify)
        return this.shouldVerify = true;

      this.router.navigate([this.redirect]);
    } catch (error) {
      this.processing = false;
      this.form.setErrors({ invalidLogin: true });
    }
  }

  public async forgotPassword() {
    if (this.email.invalid || this.forgotPasswordSent) return;

    this.forgotPasswordSent = await this.auth
      .sendVerifyEmail(this.email.value, 'FORGOT_PASSWORD');
  }

  public async verify() {
    const key = await this.auth.verify(this.code);
    localStorage.setItem('key', key);

    await this.router.navigate([this.redirect]);
  }
}

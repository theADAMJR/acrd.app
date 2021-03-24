import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credentials, UserAuthService } from '../../services/user-auth.service';
import { PasswordValidators } from './password.validators';
import { UsernameValidators } from './username.validators';
import { hacker } from 'faker';
import { UsersService } from '../../services/users.service';
import { patterns } from 'src/app/types/entity-types';
import { generateUsername } from 'src/app/utils/utils';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  form = new FormGroup({
    username: new FormControl(generateUsername(), [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(32),
      Validators.pattern(patterns.username),
    ], UsernameValidators.shouldBeUnique),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(patterns.password),
    ]),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: PasswordValidators.passwordsShouldMatch });

  constructor(
    private router: Router,
    private auth: UserAuthService,
    private users: UsersService) {}

  async ngOnInit() {
    await this.updateTakenUsernames();
  }

  async signUp(user: Credentials) {
    if (this.form.invalid) return;

    await this.auth.signUp(user);
    await this.auth.login(user);
    await this.router.navigate(['/']);
  }

  async updateTakenUsernames() {
    const usernames = await this.users.getUsernames();
    UsernameValidators.takenUsernames = usernames ?? [];
  }
}

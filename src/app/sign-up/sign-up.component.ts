import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credentials, User, UserAuthService } from '../services/user-auth.service';
import { UsersService } from '../services/users.service';
import { PasswordValidators } from './password.validators';
import { UsernameValidators } from './username.validators';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
    constructor(private router: Router, private users: UsersService, private auth: UserAuthService) {}

    get username() { return this.form.get('username'); }
    get password() { return this.form.get('password'); }
    get confirmPassword() { return this.form.get('confirmPassword'); }

    form = new FormGroup({
        username: new FormControl('',
        [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[\w-|_]+$/)
        ], UsernameValidators.shouldBeUnique),
        password: new FormControl('',
        [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*[a-z])/gm),
            Validators.pattern(/(?=.*[A-Z])/gm),
            Validators.pattern(/(?=.*[0-9])/gm),
            Validators.pattern(/(?=.*[!@#$%^&*])/gm)
        ]),
        confirmPassword: new FormControl('', Validators.required)
    }, { validators: PasswordValidators.passwordsShouldMatch });

    async ngOnInit() {
        await this.updateTakenUsernames();
    }

    async signUp(user: Credentials) {
        await this.auth.signUp(user);
        await this.auth.login(user);
        await this.router.navigate(['/']);
    }

    async updateTakenUsernames() {
        const users = await this.users.getAll();
        UsernameValidators.takenUsernames = users.map(u => u.username);
    }
}

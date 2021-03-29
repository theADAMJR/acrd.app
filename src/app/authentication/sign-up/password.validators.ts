import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable()
export class PasswordValidators {
  public static passwordsShouldMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    
    return (password !== confirmPassword)
      ? { passwordMismatch: true }
      : null;
  }

  public static newPasswordShouldNotMatch(control: AbstractControl): ValidationErrors | null {
    const oldPassword = control.get('oldPassword').value;
    const newPassword = control.get('newPassword').value;
    
    return (oldPassword === newPassword)
      ? { passwordMatch: true }
      : null;
  }

  public static emailOrUsernameRequired(control: AbstractControl): ValidationErrors | null {
    const username = control.get('username').value;
    const email = control.get('email').value;
    
    return (email || username)
      ? null
      : { emailOrUsernameRequired: true };
  }
}

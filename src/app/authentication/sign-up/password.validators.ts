import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable()
export class PasswordValidators {
  public static passwordsShouldMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    console.log(control);
    
    return (password !== confirmPassword)
      ? { passwordMismatch: true }
      : null;
  }
}

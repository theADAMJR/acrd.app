import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable()
export class UsernameValidators {
  static takenUsernames: string[] = [];

  static async shouldBeUnique(control: AbstractControl): Promise<ValidationErrors> | null {
    return new Promise(resolve => {
      const isTaken = UsernameValidators.takenUsernames
        .some(u => u.toLowerCase() === control.value.toLowerCase());
      resolve((isTaken) ? { shouldBeUnique: true } : null);
    });
  }
}

import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Injectable({ providedIn: 'root' })
export class UsernameValidators {
  constructor(
    private userService: UserService,
  ) {}

  public async shouldBeUnique(control: AbstractControl): Promise<ValidationErrors> | null {
    const isTaken = await this.userService.checkUsername(control.value)
      && this.userService.self.username !== control.value;       
    return (isTaken) ? { shouldBeUnique: true } : null;
  }

  public async emailInUse(control: AbstractControl) {
    const inUse = await this.userService.checkEmail(control.value);
    return (inUse) ? { emailInUse: true } : null;
  }
}

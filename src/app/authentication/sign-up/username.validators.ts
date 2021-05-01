import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Injectable({ providedIn: 'root' })
export class UsernameValidators {
  constructor(
    private usersService: UsersService,
  ) {}

  public async shouldBeUnique(control: AbstractControl): Promise<ValidationErrors> | null {
    const isTaken = await this.usersService.checkUsername(control.value)
      && this.usersService.self.username !== control.value;       
    return (isTaken) ? { shouldBeUnique: true } : null;
  }

  public async emailInUse(control: AbstractControl) {
    const inUse = await this.usersService.checkEmail(control.value);
    return (inUse) ? { emailInUse: true } : null;
  }
}

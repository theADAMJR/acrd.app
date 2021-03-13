import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveChangesComponent } from './save-changes/save-changes.component';
import { OnDestroy, Directive } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { WSService } from '../../services/ws.service';
import { LogService } from '../../services/log.service';
import { UsersService } from '../../services/users.service';
import { Lean } from 'src/app/types/entity-types';

@Directive()
export abstract class UserConfig implements OnDestroy {
  form: FormGroup;
  user: Lean.User;
  originalUser: Lean.User;

  private saveChanges$: Subscription;  
  private valueChanges$: Subscription;  
  
  constructor(
    protected usersService: UsersService,
    protected route: ActivatedRoute,
    public saveChanges: MatSnackBar,
    protected ws: WSService,
    protected log: LogService,
    protected router: Router) {}

  /**
   * Load all required data for the form, and hook events.
   */
  async init() {
    await this.usersService.init();
    
    this.user = this.usersService.user;
    this.originalUser = JSON.parse(JSON.stringify(this.user));
    
    await this.resetForm();

    this.valueChanges$ = this.form.valueChanges
      .subscribe(() => this.openSaveChanges()); 

    document.body.onkeyup = ({ key }) => {
      if (key !== 'Escape') return;
  
      this.close();
    };  
  }
  close() {
    this.router.navigate(['/channels/' + this.user._id]);
  }

  private async resetForm() {   
    this.user = JSON.parse(JSON.stringify(this.originalUser));   
    this.form = await this.buildForm(this.user);
  }

  /**
   * Build the form to be used.
   * Called when on form init.
   */
  abstract buildForm(user: Lean.User): FormGroup | Promise<FormGroup>;
  
  openSaveChanges() {
    const snackBarRef = this.saveChanges._openedSnackBarRef;   
    if (this.form.invalid || snackBarRef) return;

    this.saveChanges$ = this.saveChanges.openFromComponent(SaveChangesComponent).afterOpened()
    .subscribe(() => {
      const component = this.saveChanges._openedSnackBarRef.instance as SaveChangesComponent;
      component.onSave.subscribe(async() => await this.submit());
      component.onReset.subscribe(async() => await this.reset());
    });    
  }

  /**
   * Clean up subscriptions - to prevent memory leak.
   */  
  ngOnDestroy() {    
    this.valueChanges$?.unsubscribe();
    this.saveChanges$?.unsubscribe();
  }

  /**
   * Send the form data to the API.
   */
  async submit() {
    try {
      if (this.form.invalid) return;

      this.usersService.user = Object.assign(this.user, this.form.value);

      this.log.info('SEND USER_UPDATE', 'mcnfg');
      this.ws.emit('USER_UPDATE', { userId: this.user._id, partialUser: this.form.value });
    } catch {
      alert('An error occurred when submitting the form - check console');
    }
  }

  /**
   * Reset form values, and rebuild form.
   */
  async reset() {
    await this.resetForm();
    this.user = JSON.parse(JSON.stringify(this.originalUser));
    
    this.form.valueChanges
      .subscribe(() => this.openSaveChanges()); 
  }

  // input events

  add(event: MatChipInputEvent, array: any[]) {    
    const { value, input } = event;
  
    if ((value || '').trim())
      array.push(value.trim());
  
    if (input) 
      input.value = '';

    this.openSaveChanges();
  }
  
  remove(item: any, array: any[]) {
    const index = array.indexOf(item);
    if (index >= 0)
      array.splice(index, 1);
    
    this.openSaveChanges();
  }
}

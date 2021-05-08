import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveChangesComponent } from './save-changes/save-changes.component';
import { OnDestroy, Directive } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { WSService } from '../../services/ws.service';
import { LogService } from '../../services/log.service';
import { UserService } from '../../services/api/user.service';
import { Lean, UserTypes } from 'src/app/types/entity-types';

@Directive()
export abstract class UserConfig implements OnDestroy {
  public form: FormGroup;
  public user: UserTypes.Self;
  public originalUser: UserTypes.Self;

  private saveChanges$: Subscription;  
  private valueChanges$: Subscription;  
  
  constructor(
    protected userService: UserService,
    protected route: ActivatedRoute,
    public saveChanges: MatSnackBar,
    protected ws: WSService,
    protected log: LogService,
    protected router: Router,
  ) {}

  /**
   * Load all required data for the form, and hook events.
   */
  public async init() {
    await this.userService.init();
    
    this.user = this.userService.self;
    this.originalUser = JSON.parse(JSON.stringify(this.user));
    
    await this.resetForm();

    this.valueChanges$ = this.form.valueChanges
      .subscribe(() => this.openSaveChanges()); 
  }

  private async resetForm() {   
    this.user = JSON.parse(JSON.stringify(this.originalUser));   
    this.form = await this.buildForm(this.user);
  }

  /**
   * Build the form to be used.
   * Called when on form init.
   */
  public abstract buildForm(user: Lean.User): FormGroup | Promise<FormGroup>;
  
  public openSaveChanges() {    
    const snackBarRef = this.saveChanges._openedSnackBarRef;   
    if (this.form.invalid || snackBarRef) return;

    this.saveChanges$ = this.saveChanges
      .openFromComponent(SaveChangesComponent)
      .afterOpened()
      .subscribe(() => {
        const component: SaveChangesComponent = this.saveChanges._openedSnackBarRef.instance;
        component.onSave.subscribe(() => this.submit());
        component.onReset.subscribe(() => this.reset());
      });    
  }

  /**
   * Clean up subscriptions - to prevent memory leak.
   */  
  public ngOnDestroy() {    
    this.valueChanges$?.unsubscribe();
    this.saveChanges$?.unsubscribe();
  }

  /**
   * Send the form data to the API.
   */
  public async submit() {
    if (this.form.invalid) return;

    this.userService.self = Object.assign(this.user, this.form.value);

    this.ws.emitAsync('USER_UPDATE', {
      key: localStorage.getItem('key'),
      partialUser: this.form.value,
    }, this);
  }

  /**
   * Reset form values, and rebuild form.
   */
  public async reset() {
    await this.resetForm();
    this.user = JSON.parse(JSON.stringify(this.originalUser));
    
    this.form.valueChanges
      .subscribe(() => this.openSaveChanges()); 
  }

  // input events

  public add(event: MatChipInputEvent, array: any[]) {    
    const { value, input } = event;
  
    if ((value || '').trim())
      array.push(value.trim());
  
    if (input) 
      input.value = '';

    this.openSaveChanges();
  }
  
  public remove(item: any, array: any[]) {
    const index = array.indexOf(item);
    if (index >= 0)
      array.splice(index, 1);
    
    this.openSaveChanges();
  }
}

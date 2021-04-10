import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveChangesComponent } from './save-changes/save-changes.component';
import { GuildService } from '../../services/guild.service';
import {  OnDestroy, Directive } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { WSService } from '../../services/ws.service';
import { LogService } from '../../services/log.service';
import { Lean } from 'src/app/types/entity-types';

@Directive()
export abstract class ModuleConfig implements OnDestroy {
  form: FormGroup;
  guild: Lean.Guild;
  originalGuild: Lean.Guild;

  get guildId() { return this.route.snapshot.paramMap.get('guildId'); }

  private saveChanges$: Subscription;  
  private valueChanges$: Subscription;  
  
  constructor(
    protected guildService: GuildService,
    protected route: ActivatedRoute,
    public saveChanges: MatSnackBar,
    protected ws: WSService,
    protected log: LogService,
    protected router: Router) {}

  /**
   * Load all required data for the form, and hook events.
   */
  async init() {
    await this.guildService.init();
    
    this.guild = this.guildService.getGuild(this.guildId);
    this.originalGuild = JSON.parse(JSON.stringify(this.guild));
    
    await this.resetForm();

    this.valueChanges$ = this.form.valueChanges
      .subscribe(() => this.openSaveChanges());
  }

  private async resetForm() {   
    this.guild = JSON.parse(JSON.stringify(this.originalGuild));   
    this.form = await this.buildForm(this.guild);
  }

  /**
   * Build the form to be used.
   * Called when on form init.
   */
  abstract buildForm(guild: Lean.Guild): FormGroup | Promise<FormGroup>;
  
  openSaveChanges() {
    const snackBarRef = this.saveChanges._openedSnackBarRef;
    if (!this.form.valid || snackBarRef) return;

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
    console.log(this.form.value);
    try {
      if (!this.form.valid) return;

      this.ws.once('GUILD_UPDATE', ({ partialGuild }) => {
        this.guild = {
          ...this.guild,
          ...partialGuild,
        }
      }, this);

      this.ws.emit('GUILD_UPDATE', {
        guildId: this.guildId,
        partialGuild: this.form.value,
      });
    } catch {
      alert('An error occurred when submitting the form - check console');
    }
  }

  /**
   * Reset form values, and rebuild form.
   */
  async reset() {
    await this.resetForm();
    this.guild = JSON.parse(JSON.stringify(this.originalGuild));
    
    this.form.valueChanges
      .subscribe(() => this.openSaveChanges()); 
  }
  
  async deleteGuild() {
    const confirmation = prompt(`Please type 'CONFIRM' if you wish to delete this guild.`);
    if (confirmation !== 'CONFIRM') return;

    this.ws.emit('GUILD_DELETE', { guildId: this.guildId });

    const index = this.guildService.guilds.findIndex(g => g._id === this.guildId);
    this.guildService.guilds.splice(index, 1);

    await this.router.navigate(['/channels/@me']);
    await this.log.success();
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

  getChannel(id: string) {
    return this.guild.channels.find(c => c._id === id);
  }
}
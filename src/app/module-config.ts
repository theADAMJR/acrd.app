import { ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveChangesComponent } from './save-changes/save-changes.component';
import { GuildService } from './services/guild.service';
import { Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

export abstract class ModuleConfig {
    abstract moduleName: string;

    form: FormGroup;

    guildId: string;
    savedGuild: any;
    private originalSavedGuild: any;

    textChannels: any = [];
    roles: any = [];

    MessageFilter = MessageFilter;    
  
    constructor(
        protected guildService: GuildService,
        protected route: ActivatedRoute,
        protected saveChanges: MatSnackBar) {}

    /**
     * Load all required data for the form, and hook events.
     */
    async init() {
        this.guildId = this.route.snapshot.paramMap.get('id');

        const channels = await this.guildService.getChannels(this.guildId);
        this.textChannels = channels.filter(c => c.type === 'text');

        this.roles = await this.guildService.getRoles(this.guildId);

        try {
            this.savedGuild = await this.guildService.getSavedGuild(this.guildId);
            this.originalSavedGuild = this.savedGuild;            
        } catch { alert('An error occurred loading the saved guild'); }
        
        this.form = await this.buildForm();
        this.initFormValues(this.savedGuild);

        this.form.valueChanges
            .subscribe(() => this.openSaveChanges());            
    }

    /**
     * Build the form to be used
     * Called when on form init.
     */
    protected abstract buildForm(): FormGroup | Promise<FormGroup>;
    /**
     * Initialize all form values.
     * Called on reset, and on init.
     */
    protected abstract initFormValues(savedGuild: any): void;
    
    private openSaveChanges() {
        const snackBarRef = this.saveChanges._openedSnackBarRef;
        if (!this.form.valid || snackBarRef) return;

        this.saveChanges.openFromComponent(SaveChangesComponent).afterOpened()
        .subscribe(() => {
            const component = this.saveChanges._openedSnackBarRef.instance as SaveChangesComponent;
            component.onSave.subscribe(async() => await this.submit());
            component.onReset.subscribe(async() => await this.reset());
        });        
    }

    /**
     * Send the form data to the API.
     */
    async submit() {
        await this.guildService.saveGuild(this.guildId, this.moduleName, this.form.value);
    }

    /**
     * Reset form values, and rebuild form.
     */
    async reset() {
        this.form = await this.buildForm();
        this.initFormValues(this.originalSavedGuild);
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

export enum MessageFilter { Words, Links }

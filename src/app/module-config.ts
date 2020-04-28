import { ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveChangesComponent } from './dashboard/save-changes/save-changes.component';
import { GuildService } from './services/guild.service';
import {  OnDestroy } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription } from 'rxjs';


export abstract class ModuleConfig implements OnDestroy {
    abstract moduleName: string;

    form: FormGroup;

    guildId: string;
    savedGuild: any;
    originalSavedGuild: any;

    textChannels: any = [];
    roles: any = [];

    private saveChanges$: Subscription;  
    private valueChanges$: Subscription;  
  
    constructor(
        protected guildService: GuildService,
        protected route: ActivatedRoute,
        public saveChanges: MatSnackBar) {}

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
            this.originalSavedGuild = JSON.parse(JSON.stringify(this.savedGuild));            
        } catch { alert('An error occurred loading the saved guild'); }
        
        await this.resetForm();

        this.initFormValues(this.savedGuild);        

        this.valueChanges$ = this.form.valueChanges
            .subscribe(() => this.openSaveChanges());            
    }

    private async resetForm() {        
        this.form = await this.buildForm();
        this.form.addControl('enabled',
                new FormControl(this.savedGuild[this.moduleName].enabled));
    }

    /**
     * Build the form to be used.
     * Called when on form init.
     */
    abstract buildForm(): FormGroup | Promise<FormGroup>;
    /**
     * Initialize all form values.
     * Called on reset, and on init.
     */
    abstract initFormValues(savedGuild: any): void;
    
    private openSaveChanges() {
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
            if (this.form.valid)
                await this.guildService.saveGuild(this.guildId, this.moduleName, this.form.value);
        } catch { alert('An error occurred when submitting the form - check console'); }
    }

    /**
     * Reset form values, and rebuild form.
     */
    async reset() {
        await this.resetForm();
        this.savedGuild = JSON.parse(JSON.stringify(this.originalSavedGuild));
        
        this.initFormValues(this.savedGuild);
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
import { ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveChangesComponent } from './save-changes/save-changes.component';
import { GuildService } from './services/guild.service';
import { Input } from '@angular/core';

export abstract class ModuleConfig {
    abstract form: FormGroup;
    abstract moduleName: string;

    unsaved = false;

    savedGuild: any;
    guildId: string;

    textChannels: any = [];
    roles: any = [];
    
    private originalSavedGuild: any;
  
    constructor(
        protected guildService: GuildService,
        protected route: ActivatedRoute,
        protected saveChanges: MatSnackBar) {}

    async init() {
        this.guildId = this.route.snapshot.paramMap.get('id');

        const channels = await this.guildService.getChannels(this.guildId);
        this.textChannels = channels.filter(c => c.type === 'text');

        this.roles = await this.guildService.getRoles(this.guildId);

        try {
            this.savedGuild = await this.guildService.getSavedGuild(this.guildId);
            this.originalSavedGuild = this.savedGuild;            
        } catch { alert('An error occurred loading the saved guild'); }
        
        this.initFormValues(this.savedGuild);

        this.form.valueChanges
            .subscribe((formValue) => this.openSaveChanges(formValue));            
    }

    protected abstract initFormValues(savedGuild: any): void;

    openSaveChanges(formValue?: any) {
        const snackBarRef = this.saveChanges._openedSnackBarRef;
        if (!this.form.valid || snackBarRef) return;

        this.saveChanges.openFromComponent(SaveChangesComponent).afterOpened()
        .subscribe(() => {
            const component = this.saveChanges._openedSnackBarRef.instance as SaveChangesComponent;
            component.onSave.subscribe(async() => await this.submit());
            component.onReset.subscribe(() => this.reset());
        });        
    }

    async submit() {
        await this.guildService.saveGuild(this.guildId, this.moduleName, this.form.value);
    }

    reset() {
        this.initFormValues(this.originalSavedGuild);
    }
}

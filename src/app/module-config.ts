import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveChangesComponent } from './save-changes/save-changes.component';
import { GuildService } from './services/guild.service';

export abstract class ModuleConfig {
    abstract form: FormGroup;

    unsaved = false;

    originalSavedGuild: any;
    savedGuild: any;    
    guild: any;

    textChannels: any = [];
    roles: any = [];
  
    constructor(
        protected guildService: GuildService,
        protected route: ActivatedRoute,
        protected saveChanges: MatSnackBar) {}

    async init() {        
        const id = this.route.snapshot.paramMap.get('id');

        this.guild = await this.guildService.getGuild(id);

        const channels = await this.guildService.getChannels(this.guild?.id);
        this.textChannels = channels.filter(c => c.type === 'text');

        this.roles = await this.guildService.getRoles(this.guild?.id);

        try {            
            this.savedGuild = await this.guildService.getSavedGuild(id);
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
        await this.guildService.saveGuild(this.guild.id, this.form.value);
    }

    reset() {
        this.initFormValues(this.originalSavedGuild);
    }
}

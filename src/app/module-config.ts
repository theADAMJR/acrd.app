import { AuthService } from './auth.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveChangesComponent } from './save-changes/save-changes.component';
import { GuildService } from './guild.service';

export abstract class ModuleConfig {
    abstract form: FormGroup;

    unsaved = false;

    savedGuild: any;    
    guild: any;

    channels: any = [];
    roles: any = [];
  
    constructor(
        protected guildService: GuildService,
        protected route: ActivatedRoute,
        protected saveChanges: MatSnackBar) {}

    async init() {
        const id = this.route.snapshot.paramMap.get('id');

        this.guild = await this.guildService.getGuild(id);
        this.channels = await this.guildService.getChannels(this.guild?.id);
        this.roles = await this.guildService.getRoles(this.guild?.id);

        this.savedGuild = await this.guildService.getSavedGuild(id);

        this.form.valueChanges
            .subscribe(this.openSaveChanges);
    }

    openSaveChanges(value?: any) {        
        this.saveChanges.openFromComponent(SaveChangesComponent);
    }

    onSubmit(value: any) {
      alert('submit'); 
    }
}

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
        protected auth: AuthService,
        protected guildService: GuildService,
        protected route: ActivatedRoute,
        private snackBar: MatSnackBar) {}

    async init() {
        const id = this.route.snapshot.paramMap.get('id');

        this.guild = await this.auth.getGuild(id);
        this.channels = await this.guildService.getChannels(this.guild?.id);
        this.roles = await this.guildService.getRoles(this.guild?.id);

        this.savedGuild = await this.auth.getSavedGuild(id);

        this.form.valueChanges
            .subscribe(this.openSaveChanges);
    }

    openSaveChanges(value: any) {
        if (this.unsaved) return;
        this.unsaved = true;
        
        this.snackBar.openFromComponent(SaveChangesComponent, {
            duration: 3000
        });
    }

    onSubmit(value: any) {
      alert('submit'); 
    }
}

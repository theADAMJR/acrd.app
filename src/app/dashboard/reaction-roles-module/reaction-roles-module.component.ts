import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from 'src/app/module-config';
import { toIterable } from 'src/app/utils';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { GuildService } from 'src/app/services/guild.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reaction-roles-module',
  templateUrl: './reaction-roles-module.component.html',
  styleUrls: ['./reaction-roles-module.component.css']
})
export class ReactionRolesModuleComponent extends ModuleConfig implements OnInit {
  moduleName = 'reactionRoles';

  reactionRoleMessages = [];
  reactionRolesIndices = toIterable(4);

  get reactionRoles() { return this.savedGuild.reactionRoles; }

  constructor(
    public guildService: GuildService,
    route: ActivatedRoute,
    public userService: UserService,
    saveChanges: MatSnackBar) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();

    await this.updateReactionRolePreviews();
  }

  buildForm({ reactionRoles }: any) {
    const formGroup = new FormGroup({
      configs: new FormArray([])
    });

    for (const i of this.reactionRolesIndices) {
      const config = reactionRoles.configs[i];
      
      const emojiPattern = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1}/gm;

      (formGroup.get('configs') as FormArray).setControl(i,
        new FormGroup({
          channel: new FormControl(config?.channel ?? ''),
          role: new FormControl(config?.role ?? ''),
          emote: new FormControl(config?.emote ?? '', 
            Validators.pattern(emojiPattern)),
          messageId: new FormControl(config?.messageId ?? '', Validators.pattern(/[0-9]{18}/g))
        }));    
    }
    return formGroup;
  }

  async submit() {
    await super.submit();

    await this.updateReactionRolePreviews();
  }

  async updateReactionRolePreviews() {
    this.reactionRoleMessages = [];
    for (const i of this.reactionRolesIndices) {
      const config = (this.form.controls.configs as FormArray)
        .get(i.toString())?.value;
      if (!(config.channel && config.messageId))
        return this.reactionRoleMessages.push(null);      

      try {
        const msg = await this.getMessage(config.channel, config.messageId);
        this.reactionRoleMessages.push(msg);        
      } catch { this.reactionRoleMessages.push(null); }
    }
  }

  filterFormValue() {
    this.form.value.configs = this.form.value.configs
      .filter(value => Object.keys(value).some(key => value[key]));
  }

  getMessage(channelId: string, messageId: string) {
    return this.guildService.getMessage(this.guildId, channelId, messageId);
  }

  toDate(dateString: string) { return new Date(dateString); }
}

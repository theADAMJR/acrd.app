import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleConfig } from 'src/app/module-config';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-roles-component',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css', '../overview/guild-settings.component.css']
})
export class RolesComponent extends ModuleConfig implements OnInit {
  selectedRole: any;
  presetColors = [
    '#6E8481',
    '#A2B6AD',
    '#576067'
  ];

  permissionsForm: FormGroup;

  get isEveryone() {
    return this.selectedRole?.name === '@everyone';
  }

  get permissions(): number {
    let permissions = 0;
    for (const formGroupName in this.permissionsForm.value)
      for (const key in this.permissionsForm.get(formGroupName).value) {
        const hasPermission = this.permissionsForm
          .get(formGroupName)
          .get(key).value;

        permissions |= (hasPermission)
          ? GeneralPermission[key] || TextChannelPermission[key] || VoiceChannelPermission[key]
          : 0;
      }

    return permissions;
  }

  constructor(
    route: ActivatedRoute,
    router: Router,
    guildService: GuildService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService) {
      super(guildService, route, snackbar, ws, log, router);
    }

  async ngOnInit() {
    await super.init();

    this.selectRole(this.guild.roles[0]);
  }

  selectRole(role: any) {
    this.selectedRole = role;
    this.reset();
  }

  buildForm(guild: any): FormGroup {
    if (!this.selectedRole)
      return new FormGroup({});

    const role = guild.roles.find(r => r._id === this.selectedRole?._id);
    const hasPermission = (perm: any) => Boolean(role?.permissions & perm);

    this.permissionsForm = new FormGroup({
      general: new FormGroup({
        ADMINISTRATOR: new FormControl(hasPermission(GeneralPermission.ADMINISTRATOR)),
        VIEW_AUDIT_LOG: new FormControl(hasPermission(GeneralPermission.VIEW_AUDIT_LOG)),
        MANAGE_GUILD: new FormControl(hasPermission(GeneralPermission.MANAGE_GUILD)),
        MANAGE_ROLES: new FormControl(hasPermission(GeneralPermission.MANAGE_ROLES)),
        MANAGE_CHANNELS: new FormControl(hasPermission(GeneralPermission.MANAGE_CHANNELS)),
        BAN_MEMBERS: new FormControl(hasPermission(GeneralPermission.BAN_MEMBERS)),
        KICK_MEMBERS: new FormControl(hasPermission(GeneralPermission.KICK_MEMBERS)),
        CREATE_INVITE: new FormControl(hasPermission(GeneralPermission.CREATE_INVITE)),
        CHANGE_NICKNAME: new FormControl(hasPermission(GeneralPermission.CHANGE_NICKNAME)),
        MANAGE_NICKNAMES: new FormControl(hasPermission(GeneralPermission.MANAGE_NICKNAMES)),
        VIEW_CHANNELS: new FormControl(hasPermission(GeneralPermission.VIEW_CHANNELS))
      }),
      text: new FormGroup({
        SEND_MESSAGES: new FormControl(hasPermission(TextChannelPermission.SEND_MESSAGES)),
        READ_MESSAGE_HISTORY: new FormControl(hasPermission(TextChannelPermission.READ_MESSAGE_HISTORY)),
        MENTION_EVERYONE: new FormControl(hasPermission(TextChannelPermission.MENTION_EVERYONE)),
        MANAGE_MESSAGES: new FormControl(hasPermission(TextChannelPermission.MANAGE_MESSAGES)),
        ADD_REACTIONS: new FormControl(hasPermission(TextChannelPermission.ADD_REACTIONS)),
      }),
      voice: new FormGroup({
        CONNECT: new FormControl(hasPermission(VoiceChannelPermission.CONNECT)),
        MOVE_MEMBERS: new FormControl(hasPermission(VoiceChannelPermission.MOVE_MEMBERS)),
        MUTE_MEMBERS: new FormControl(hasPermission(VoiceChannelPermission.MUTE_MEMBERS)),
        SPEAK: new FormControl(hasPermission(VoiceChannelPermission.SPEAK))
      })
    });
    this.permissionsForm.valueChanges
      .subscribe(() => this.openSaveChanges());

    return new FormGroup({
      name: new FormControl(role?.name ?? '', [ Validators.required, Validators.maxLength(32) ]),
      color: new FormControl(this.presetColors[1]),
      hoisted: new FormControl(this.isEveryone ? false : role?.mentionable),
      mentionable: new FormControl(this.isEveryone ? false : role?.mentionable)
    });
  }

  clearPermissions() {
    for (const formGroupName in this.permissionsForm.value)
      for (const key in this.permissionsForm.get(formGroupName).value)
        this.permissionsForm
          .get(formGroupName)
          .get(key)
          .setValue(false);
  }

  async submit() {
    this.form.value.permissions = this.permissions;
    
    for (const key in this.form.value)
      this.selectedRole[key] = this.form.value[key];

    console.log(this.form.value);
    console.log(this.permissionsForm.value);
    try {
      if (!this.form.valid) return;

      await this.guildService.saveGuild(this.guildId, { roles: [this.selectedRole] });
      
      this.log.info('SEND GUILD_UPDATE', 'mcnfg');
      this.ws.socket.emit('GUILD_UPDATE', { guild: this.guild });

      this.log.info('SEND GUILD_ROLE_UPDATE', 'mcnfg');
      this.ws.socket.emit('GUILD_ROLE_UPDATE', { role: this.selectedRole });
    } catch {
      alert('An error occurred when submitting the form - check console');
    }
  }
}

export enum GeneralPermission {
  VIEW_CHANNELS = 1024,
  MANAGE_NICKNAMES = 512,
  CHANGE_NICKNAME = 256,
  CREATE_INVITE = 128,
  KICK_MEMBERS = 64,
  BAN_MEMBERS = 32,
  MANAGE_CHANNELS = 16,
  MANAGE_ROLES = 8,
  MANAGE_GUILD = 4,
  VIEW_AUDIT_LOG = 2,
  ADMINISTRATOR = 1
}
export enum TextChannelPermission {
  ADD_REACTIONS = 2048 * 16,
  MENTION_EVERYONE = 2048 * 8,
  READ_MESSAGE_HISTORY = 2048 * 4,
  MANAGE_MESSAGES = 2048 * 2,
  SEND_MESSAGES = 2048
}
export enum VoiceChannelPermission {
  MOVE_MEMBERS = 32768 * 8,
  MUTE_MEMBERS = 32768 * 4,
  SPEAK = 32768 * 2,
  CONNECT = 32768
}
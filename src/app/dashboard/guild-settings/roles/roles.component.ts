import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleConfig } from 'src/app/module-config';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { GeneralPermission, Permission, PermissionsService, TextChannelPermission, VoiceChannelPermission } from 'src/app/services/permissions.service';
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
    this.hookWSEvents();
  }

  private hookWSEvents() {
    this.ws.socket.on('GUILD_ROLE_CREATE', async ({ role }) => {
      this.log.info('GET GUILD_ROLE_CREATE', 'mcnfg');
      
      this.guild.roles.push(role);
      this.originalGuild = {...this.guild};

      await this.selectRole(role);
    });

    this.ws.socket.on('GUILD_ROLE_DELETE', async ({ roleId }) => {
      this.log.info('GET GUILD_ROLE_CREATE', 'mcnfg');

      const index = this.guild.roles.findIndex(r => r._id === roleId);
      this.guild.roles.splice(index, 1);
      this.originalGuild = {...this.guild};

      await this.selectRole(this.guild.roles[0]);
    });

    this.ws.socket.on('GUILD_ROLE_UPDATE', ({ role }) => {
      this.log.info('GET GUILD_ROLE_UPDATE', 'mcnfg');

      const index = this.guild.roles.findIndex(r => r._id === role._id);
      this.guild.roles[index] = role;
      this.originalGuild = {...this.guild};
    });
  }

  async selectRole(role: any) {
    this.selectedRole = role;
    await this.reset();
  }

  buildForm(guild: any): FormGroup {
    if (!this.selectedRole)
      return new FormGroup({});

    const role = guild.roles.find(r => r._id === this.selectedRole?._id);
    const hasPermission = (perm: Permission) => Boolean(role?.permissions & perm);

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
      name: new FormControl(role?.name ?? '', [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^(?!everyone|here|someone).*$/)
      ]),
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

    try {
      if (!this.form.valid) return;

      this.log.info('SEND GUILD_ROLE_UPDATE', 'mcnfg');
      this.ws.socket.emit('GUILD_ROLE_UPDATE', { role: this.selectedRole });
    } catch {
      alert('An error occurred when submitting the form - check console');
    }
  }

  newRole() {
    this.log.info('SEND GUILD_ROLE_CREATE', 'mcnfg');
    this.ws.socket.emit('GUILD_ROLE_CREATE',
      { partialRole: { ...this.selectedRole, name: 'New Role' } });
  }

  deleteRole() {
    this.log.info('SEND GUILD_ROLE_DELETE', 'mcnfg');
    this.ws.socket.emit('GUILD_ROLE_DELETE', ({ roleId: this.selectedRole._id, guildId: this.guildId }));
  }
}
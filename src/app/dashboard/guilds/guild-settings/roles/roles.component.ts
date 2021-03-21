import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleConfig } from 'src/app/dashboard/components/module-config';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean, PermissionTypes } from '../../../../types/entity-types';

@Component({
  selector: 'app-roles-component',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css', '../overview/guild-settings.component.css']
})
export class RolesComponent extends ModuleConfig implements OnInit {
  selectedRole: Lean.Role;
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
          ? PermissionTypes.General[key] || PermissionTypes.Text[key] || PermissionTypes.Voice[key]
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
    this.ws.on('GUILD_ROLE_CREATE', async ({ role }) => {
      this.guild.roles.push(role);
      this.originalGuild = {...this.guild};

      await this.selectRole(role);
    }, this)
    .on('GUILD_ROLE_DELETE', async ({ roleId }) => {
      const index = this.guild.roles.findIndex(r => r._id === roleId);
      this.guild.roles.splice(index, 1);
      this.originalGuild = {...this.guild};

      await this.selectRole(this.guild.roles[0]);
    }, this)
    .on('GUILD_ROLE_UPDATE', ({ roleId, partialRole }) => {
      const index = this.guild.roles.findIndex(r => r._id === roleId);
      this.guild.roles[index] = {
        ...this.guild.roles[index],
        ...partialRole
      };
      this.originalGuild = {...this.guild};
    }, this);
  }

  async selectRole(role: Lean.Role) {
    this.selectedRole = role;
    await this.reset();
  }

  buildForm(guild: Lean.Guild): FormGroup {
    if (!this.selectedRole)
      return new FormGroup({});

    const role = guild.roles.find(r => r._id === this.selectedRole?._id);
    const hasPermission = (perm: PermissionTypes.Permission) => Boolean(role?.permissions & perm);

    this.permissionsForm = new FormGroup({
      general: new FormGroup({
        ADMINISTRATOR: new FormControl(hasPermission(PermissionTypes.General.ADMINISTRATOR)),
        VIEW_AUDIT_LOG: new FormControl(hasPermission(PermissionTypes.General.VIEW_AUDIT_LOG)),
        MANAGE_GUILD: new FormControl(hasPermission(PermissionTypes.General.MANAGE_GUILD)),
        MANAGE_ROLES: new FormControl(hasPermission(PermissionTypes.General.MANAGE_ROLES)),
        MANAGE_CHANNELS: new FormControl(hasPermission(PermissionTypes.General.MANAGE_CHANNELS)),
        BAN_MEMBERS: new FormControl(hasPermission(PermissionTypes.General.BAN_MEMBERS)),
        KICK_MEMBERS: new FormControl(hasPermission(PermissionTypes.General.KICK_MEMBERS)),
        CREATE_INVITE: new FormControl(hasPermission(PermissionTypes.General.CREATE_INVITE)),
        CHANGE_NICKNAME: new FormControl(hasPermission(PermissionTypes.General.CHANGE_NICKNAME)),
        MANAGE_NICKNAMES: new FormControl(hasPermission(PermissionTypes.General.MANAGE_NICKNAMES)),
        VIEW_CHANNELS: new FormControl(hasPermission(PermissionTypes.General.VIEW_CHANNELS))
      }),
      text: new FormGroup({
        SEND_MESSAGES: new FormControl(hasPermission(PermissionTypes.Text.SEND_MESSAGES)),
        READ_MESSAGE_HISTORY: new FormControl(hasPermission(PermissionTypes.Text.READ_MESSAGES)),
        MENTION_EVERYONE: new FormControl(hasPermission(PermissionTypes.Text.MENTION_EVERYONE)),
        MANAGE_MESSAGES: new FormControl(hasPermission(PermissionTypes.Text.MANAGE_MESSAGES)),
        ADD_REACTIONS: new FormControl(hasPermission(PermissionTypes.Text.ADD_REACTIONS)),
      }),
      voice: new FormGroup({
        CONNECT: new FormControl(hasPermission(PermissionTypes.Voice.CONNECT)),
        MOVE_MEMBERS: new FormControl(hasPermission(PermissionTypes.Voice.MOVE_MEMBERS)),
        MUTE_MEMBERS: new FormControl(hasPermission(PermissionTypes.Voice.MUTE_MEMBERS)),
        SPEAK: new FormControl(hasPermission(PermissionTypes.Voice.SPEAK))
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

      ;
      this.ws.emit('GUILD_ROLE_UPDATE', {
        roleId: this.selectedRole._id,
        guildId: this.guildId,
        partialRole: this.form.value,
      });
    } catch {
      alert('An error occurred when submitting the form - check console');
    }
  }

  newRole() {
    ;
    this.ws.emit('GUILD_ROLE_CREATE', {
      guildId: this.guildId,
      partialRole: {
        ...this.form.value,
        name: 'New Role'
      },
    });
  }

  deleteRole() {
    ;
    this.ws.emit('GUILD_ROLE_DELETE', ({ roleId: this.selectedRole._id, guildId: this.guildId }));
  }
}

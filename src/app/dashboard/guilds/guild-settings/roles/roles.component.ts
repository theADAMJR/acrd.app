import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
  public selectedRole: Lean.Role;
  public presetColors = [ '#6E8481', '#A2B6AD', '#576067' ];
  public description/**: DescriptionType */ = {
    general: {
      'ADMINISTRATOR': `Gives all permissions. This is a dangerous permission.`,
      'BAN_MEMBERS': 'Ability to ban members from the guild.',
      'CREATE_INVITE': 'Ability to create invites for users to join this guild.',
      'KICK_MEMBERS': 'Ability to kick members from this guild.',
      'MANAGE_CHANNELS': 'Ability to create, edit, or delete channels.',
      'MANAGE_GUILD': `Ability to edit general guild settings.`,
      'MANAGE_ROLES': 'Ability to manage guild roles.',
      'VIEW_CHANNELS': 'Ability to view channels.',
    },
    text: {
      'MANAGE_MESSAGES': `Ability to manage message other member's messages.`,
      'READ_MESSAGES': `Ability to read messages,`,
      'SEND_MESSAGES': 'Ability to send messages in text channels.',
    },
  };
  public permissionType = Object.keys(PermissionTypes.All);
  public permissionsForm: FormGroup;

  public get isEveryone() {
    return this.selectedRole?.name === '@everyone';
  }

  public get permissions(): number {
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

  public async ngOnInit() {
    await super.init();

    const everyoneRole = this.guild.roles.find(r => r.name === '@everyone');
    this.selectRole(everyoneRole);
  }

  public async selectRole(role: Lean.Role) {
    this.selectedRole = role;
    await this.reset();
  }

  public buildForm(guild: Lean.Guild): FormGroup {
    if (!this.selectedRole)
      return new FormGroup({});

    this.permissionsForm = new FormGroup({
      general: this.permissionGroup(this.selectedRole, PermissionTypes.General),
      text: this.permissionGroup(this.selectedRole, PermissionTypes.Text),
      voice: this.permissionGroup(this.selectedRole, PermissionTypes.Voice),
    });
    this.permissionsForm.valueChanges
      .subscribe(() => this.openSaveChanges());

    return new FormGroup({
      color: new FormControl({
        disabled: this.isEveryone,
        value: this.selectedRole.color,
      }),
      hoisted: new FormControl({
        disabled: this.isEveryone,
        value: (this.isEveryone) ? false : this.selectedRole.mentionable,
      }),
      mentionable: new FormControl({
        disabled: this.isEveryone,
        value: this.selectedRole.mentionable,
      }),
      name: new FormControl({
        disabled: this.isEveryone,
        value: this.selectedRole.name,
      }, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/^(?!everyone|here|someone).*$/),
      ]),
    });
  }

  private permissionGroup(role: Lean.Role, type: object) {
    const hasPermission = (perm: PermissionTypes.Permission) => Boolean(role.permissions & perm);
    
    const group = new FormGroup({});
    for (const perm in type) {
      if (Number.parseInt(perm)) continue;
      group.setControl(perm, new FormControl(hasPermission(type[perm])));
    }    
    return group;
  } 

  public setPermissions(permissions = PermissionTypes.defaultPermissions) {
    for (const formGroupName in this.permissionsForm.value)
      for (const key in this.permissionsForm.get(formGroupName).value) {
        const hasPerm = Boolean(permissions & PermissionTypes.All[key]);
        this.permissionsForm
          .get(formGroupName)
          .get(key)
          .setValue(hasPerm);
      }
  }

  public async submit() {
    if (this.form.invalid) return;

    this.form.value.permissions = this.permissions;
    for (const key in this.form.value)
      this.selectedRole[key] = this.form.value[key];

    await this.updateRole();
  }

  private async updateRole() {
    const { partialRole } = await this.ws.emitAsync('GUILD_ROLE_UPDATE', {
      roleId: this.selectedRole._id,
      guildId: this.guildId,
      partialRole: this.form.value,
    }, this);

    const index = this.guild.roles.findIndex(r => r._id === this.selectedRole._id);
    this.guild.roles[index] = { ...this.guild.roles[index], ...partialRole };

    this.form.patchValue(partialRole);
  }

  public async newRole() {
    const { role } = await this.ws.emitAsync('GUILD_ROLE_CREATE', {
      guildId: this.guildId,
      partialRole: { ...this.form.value, name: 'New Role' },
    }, this);

    this.selectedRole = role;
  }

  public async deleteRole() {
    await this.ws.emitAsync('GUILD_ROLE_DELETE', {
      roleId: this.selectedRole._id,
      guildId: this.guildId,
    }, this);
    await this.selectRole(this.guild.roles[0]);
  }
}

export type DescriptionType = {
  general: { [key in keyof typeof PermissionTypes.General]: string };
  text: { [key in keyof typeof PermissionTypes.Text]: string };
  voice: { [key in keyof typeof PermissionTypes.Voice]: string };
};

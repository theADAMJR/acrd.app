import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css', '../overview/guild-settings.component.css']
})
export class InvitesComponent implements OnInit {
  public invites: Lean.Invite[];
  public guild: Lean.Guild;

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
    public log: LogService,
    public usersService: UsersService,
    public ws: WSService,
  ) {}

  public async ngOnInit() {
    const guildId = this.route.snapshot.paramMap.get('guildId');
    this.guild = this.guildService.getCached(guildId);
    this.invites = await this.guildService.getInvites(guildId);

    this.hookWSEvents();
  }

  public usesString(invite: Lean.Invite) {
    return (invite.options.maxUses)
      ? `${invite.uses}/${invite.options.maxUses}`
      : invite.uses;
  }

  private hookWSEvents() {
    this.ws.on('INVITE_DELETE', async ({ inviteCode }) => {
      await this.log.success();

      const index = this.invites.findIndex(i => i._id === inviteCode);
      this.invites.splice(index, 1);
    }, this);
  }

  public delete(inviteCode: string) {
    this.ws.emit('INVITE_DELETE', { inviteCode }, this);
  }
}

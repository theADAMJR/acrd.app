import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/services/api/guild.service';
import { UserService } from 'src/app/services/api/user.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-guild-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css']
})
export class InvitesComponent implements OnInit {
  @Input() public guild: Lean.Guild;
  public invites: Lean.Invite[];

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
    public userService: UserService,
    private ws: WSService,
  ) {}

  public async ngOnInit() {
    const guildId = this.route.snapshot.paramMap.get('guildId');
    this.guild = this.guildService.getCached(guildId);
    this.invites = await this.guildService.getInvites(guildId);
  }

  public usesString(invite: Lean.Invite) {
    return (invite.options.maxUses)
      ? `${invite.uses}/${invite.options.maxUses}`
      : invite.uses;
  }

  public async delete(inviteCode: string) {
    await this.ws.emitAsync('INVITE_DELETE', { inviteCode }, this);
      
    const index = this.invites.findIndex(i => i.id === inviteCode);
    this.invites.splice(index, 1);
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { InviteService } from 'src/app/services/invite.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  public guild: Lean.Guild;
  public invite: Lean.Invite;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public guildService: GuildService,
    public usersService: UsersService,
    public invites: InviteService,
    private ws: WSService,
  ) {}

  public async ngOnInit() {
    const code = this.route.snapshot.paramMap.get('id');
    const invite = await this.invites.fetch(code);

    if (this.guildService.getGuild(invite.guildId))
      return this.router.navigate([`/channels/${invite.guildId}`]);
  }

  public join() {
    this.ws.on('GUILD_JOIN', (args) =>
      this.guildService.updateCached(args.guild._id, args.guild), this);

    this.ws.emit('GUILD_MEMBER_ADD', { inviteCode: this.invite._id }, this);
  }
}

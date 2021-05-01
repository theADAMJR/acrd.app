import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { ChannelService } from 'src/app/services/channel.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './me-sidebar.component.html',
  styleUrls: ['./me-sidebar.component.css']
})
export class MeSidebarComponent implements OnInit {
  constructor(
    public channelService: ChannelService,
    public usersService: UsersService,
  ) {}
    
  public async ngOnInit() {
    await this.usersService.init();
    await this.channelService.init();
  }

  public getRecipient(channel: Lean.Channel) { 
    const userId = channel.memberIds
      .filter(id => id !== this.usersService.self._id)[0];
    return this.usersService.getKnown(userId);
  }
}

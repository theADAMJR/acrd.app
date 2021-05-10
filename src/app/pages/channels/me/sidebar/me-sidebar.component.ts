import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/api/user.service';
import { ChannelService } from 'src/app/services/api/channel.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './me-sidebar.component.html',
  styleUrls: ['./me-sidebar.component.css']
})
export class MeSidebarComponent implements OnInit {
  constructor(
    public channelService: ChannelService,
    public userService: UserService,
  ) {}
    
  public async ngOnInit() {
    await this.userService.init();
    await this.channelService.init();
  }

  public getRecipient(channel: Lean.Channel) { 
    const userId = channel.memberIds
      .filter(id => id !== this.userService.self.id)[0];
    return this.userService.getCached(userId);
  }
}

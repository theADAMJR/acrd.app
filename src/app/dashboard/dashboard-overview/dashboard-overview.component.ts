import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';
import { UsersService } from '../../services/users.service';
import { TabType } from '../friends-list/friends-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent {
  addFriendForm = new FormGroup({
    username: new FormControl('', [      
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(32),
      Validators.pattern(/(^(?! |^everyone$|^here$|^me$|^someone$|^discordtag$)[A-Za-z\d\-\_\! ]+(?<! )$)/)
    ])
  });
  
  friendPromptOpen = false;
  tab: TabType = 'ONLINE'; 

  get user() { return this.userService.user; }

  constructor(
    private log: LogService,
    private userService: UsersService,
    private ws: WSService) {
    document.title = 'DClone - Dashboard';

    this.setTab('ONLINE');
  }

  sendFriendRequest() {
    if (this.addFriendForm.invalid) return;

    this.log.info('SEND SEND_FRIEND_REQUEST', 'over');
    this.ws.socket.emit('SEND_FRIEND_REQUEST', { 
      senderId: this.user._id, 
      friendUsername: this.addFriendForm.value.username
    });
  }

  setTab(tab: TabType) {
    this.friendPromptOpen = false;
    this.tab = tab;
  }
}
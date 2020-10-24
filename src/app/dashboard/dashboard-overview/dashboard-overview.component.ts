import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WSService } from 'src/app/services/ws.service';
import { UsersService } from '../../services/users.service';

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

  get user() { return this.userService.user; }

  constructor(
    private userService: UsersService,
    private ws: WSService) {
    document.title = 'DClone - Dashboard';
  }

  async sendFriendRequest() {
    if (this.addFriendForm.invalid) return;

    this.ws.socket.emit('USER_FRIEND_ADD', { 
      senderId: this.user._id, 
      friendId: this.addFriendForm.value.username
    });
  }
}

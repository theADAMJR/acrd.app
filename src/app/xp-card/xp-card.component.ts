import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CustomizeXPCardComponent } from '../customize-xp-card/customize-xp-card.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-xpcard',
  templateUrl: './xp-card.component.html',
  styleUrls: ['./xp-card.component.css']
})
export class XPCardComponent implements OnInit {
  xpCardURL = '';

  get user() { return this.userService.user; }

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.updateXPCard();
  }

  updateXPCard() {
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.xpCardURL = this.userService.xpCardPreviewURL + `&cache=${randomString}`;
  }
}

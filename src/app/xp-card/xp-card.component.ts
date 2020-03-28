import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-xpcard',
  templateUrl: './xp-card.component.html',
  styleUrls: ['./xp-card.component.css']
})
export class XPCardComponent implements OnInit {
  xpCardURL = '';

  get user() { return this.auth.user; }

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    this.xpCardURL = this.auth.xpCardPreviewURL;
  }
}

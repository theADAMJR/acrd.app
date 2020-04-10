import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent {
  url = `${environment.endpoint}/invite`;

  constructor() {
    window.location.assign(this.url);
  }
}

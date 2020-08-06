import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'plus-paywall',
  templateUrl: './plus-paywall.component.html',
  styleUrls: ['./plus-paywall.component.css']
})
export class PlusPaywallComponent {
  constructor(public userService: UserService) {}
}

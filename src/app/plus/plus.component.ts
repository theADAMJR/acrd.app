import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PayService } from '../services/pay.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-plus',
  templateUrl: './plus.component.html',
  styleUrls: ['./plus.component.css']
})
export class PlusComponent {
  discordInvite = environment.discordInvite;
}

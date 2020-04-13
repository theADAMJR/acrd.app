import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PayService } from '../pay.service';

@Component({
  selector: 'app-plus',
  templateUrl: './plus.component.html',
  styleUrls: ['./plus.component.css']
})
export class PlusComponent implements OnInit {
  stripe: Stripe;

  constructor(private pay: PayService) {}

  async ngOnInit() {    
    this.stripe = await loadStripe(environment.stripePublicKey);
  }

  async checkout() {
    const { id } = await this.pay.createSession();
    await this.stripe.redirectToCheckout({ sessionId: id });
  }
}

import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { PayService } from '../services/pay.service';

@Component({
  selector: 'plus-cards',
  templateUrl: './plus-cards.component.html',
  styleUrls: ['./plus-cards.component.css']
})
export class PlusCardsComponent {
  checkoutEndpoint = `${environment.endpoint}/pay`;
  stripe: Stripe;

  constructor(
    private pay: PayService,
    public userService: UserService) {}
  
  async ngOnInit() {
    await this.userService.init();
    this.stripe = await loadStripe(environment.stripePublicKey);
  }

  async checkout(plan: number) {
    const { id } = await this.pay.createSession(plan);
    await this.stripe.redirectToCheckout({ sessionId: id });
  }
}

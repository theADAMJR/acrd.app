import { Directive, Component, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';

@Directive({
  selector: '[premium]'
})
export class PremiumDirective {
  el: HTMLElement;

  constructor(elementRef?: ElementRef) {
    if (!elementRef) return;

    this.el = elementRef.nativeElement as HTMLInputElement;
    this.el.onclick = () => alert('plz pay for plus\n\n\n\nokthanksbye');
  }
}

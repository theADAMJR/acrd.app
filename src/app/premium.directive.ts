import { Directive, Component, ElementRef } from '@angular/core';

@Directive({
  selector: '[premium]'
})
export class PremiumDirective {
  el: HTMLElement;

  constructor(elementRef?: ElementRef) {
    if (!elementRef) return;

    this.el = elementRef.nativeElement as HTMLInputElement;
    // TODO: disable if user does not have premium    
    this.el.setAttribute('readonly', '');
    this.el.onclick = () => alert('plz pay for premium\n\n\n\nokthanksbye');
  }
}

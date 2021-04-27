import { style, state, trigger, animate, transition } from '@angular/animations';

export const widthExpandCollapse = trigger('expandCollapse', [
  state('collapsed', style({ right: 0 })),
  state('expanded', style({ right: '25px' })),
  transition('collapsed <=> expanded', [ animate('200ms ease') ]),
]);

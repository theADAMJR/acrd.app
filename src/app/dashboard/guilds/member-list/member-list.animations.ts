import { style, state, trigger, animate, transition } from '@angular/animations';

export const widthExpandCollapse = trigger('expandCollapse', [
  state('collapsed', style({ width: 0 })),
  state('expanded', style({ width: '*' })),
  transition('collapsed <=> expanded', [ animate('200ms ease') ]),
]);

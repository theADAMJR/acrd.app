import { style, state, trigger, animate, transition } from '@angular/animations';

export const expandCollapse = trigger('expandCollapse', [
    state('collapsed', style({
        height: 0,
        padding: '0 20px'
    })),
    state('expanded', style({ height: '*' })),
    transition('collapsed <=> expanded', [ animate('200ms ease') ])
]);
import { style, state, trigger, animate, transition } from '@angular/animations';

export const slideUpDown = trigger('expandCollapse', [
    state('up', style({
        height: 0,
        color: 'transparent'
    })),
    state('down', style({ height: '*' })),
    transition('up <=> down', [ animate('200ms ease') ])
]);
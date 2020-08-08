import { Component, Input } from '@angular/core';

@Component({
  selector: 'waves',
  templateUrl: './waves.component.html',
  styleUrls: ['./waves.component.css']
})
export class WavesComponent {
  @Input() inverted = false;
}

import { Component, Input, OnInit } from '@angular/core';
import { uuid } from '../utils';

@Component({
  selector: 'waves',
  templateUrl: './waves.component.html',
  styleUrls: ['./waves.component.css']
})
export class WavesComponent implements OnInit {
  @Input() inverted = false;
  @Input() color: string;

  public id = uuid();

  public ngOnInit() {
    document
      .querySelectorAll(`#${this.id} #gentle-wave`)
      .forEach((w: HTMLElement) => w.style.fill = this.color);
  }
}

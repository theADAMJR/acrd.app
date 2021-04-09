import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { uuid } from '../utils';

@Component({
  selector: 'waves',
  templateUrl: './waves.component.html',
  styleUrls: ['./waves.component.css']
})
export class WavesComponent implements AfterViewInit {
  @Input() inverted = false;
  @Input() color = 'var(--background-secondary)';

  public id = uuid();

  public ngAfterViewInit() {
    console.log(this.id);
        
    document
      .querySelectorAll(`#${this.id}`)
      .forEach((w: HTMLElement) => w.style.fill = this.color);
  }
}

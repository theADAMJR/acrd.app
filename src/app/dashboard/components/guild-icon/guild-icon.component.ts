import { Component, Input } from '@angular/core';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-guild-icon',
  templateUrl: './guild-icon.component.html',
  styleUrls: ['./guild-icon.component.css']
})
export class GuildIconComponent {
  @Input()
  public guild: Lean.Guild;
}

import { Component, Input, OnInit } from '@angular/core';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-guild-settings-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedComponent implements OnInit {
  @Input() public guild: Lean.Guild;

  constructor() {}

  ngOnInit(): void {
  }
}

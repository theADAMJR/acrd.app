import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  stats: any;

  constructor(private api: ApiService) {}

  async ngOnInit() {
    this.stats = await this.api.getStats();
  }

  
}

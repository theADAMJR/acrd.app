import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import pluginDataLabels from 'chartjs-plugin-datalabels';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'popular-commands-graph',
  templateUrl: './popular-commands-graph.component.html',
  styleUrls: ['./popular-commands-graph.component.css']
})
export class PopularCommandsGraphComponent implements OnInit {
  @Input() stats: any;
  @Input() reversed = false;

  chartReady = false;
  
  barChartOptions: ChartOptions = {
    responsive: false,
    scales: {
      yAxes: [{ display: false }],
      xAxes: [{ display: false }]
    },
    plugins: {
      datalabels: { anchor: 'end', align: 'end' }
    }
  };
  barChartLabels = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [];

  constructor(private api: ApiService) {}
    
  async ngOnInit() {
    this.stats = this.stats ?? await this.api.getStats();

    this.barChartLabels = this.buildLabels();
    this.barChartData = this.buildDataSets();
    
    this.chartReady = true;
  }

  buildLabels() {
    const labels = this.stats.commands
      .map(c => c.name)
      .slice(0, 10);
    return (this.reversed) ? labels.reverse() : labels;
  }

  buildDataSets() {
    const data = this.stats.commands.map(s => s.count);
    return [
      {
        data: (this.reversed) ? data.reverse() : data,
        label: 'Commands'
      }
    ];
  }
}

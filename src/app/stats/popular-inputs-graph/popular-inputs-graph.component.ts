import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import pluginDataLabels from 'chartjs-plugin-datalabels';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'popular-inputs-graph',
  templateUrl: './popular-inputs-graph.component.html',
  styleUrls: ['./popular-inputs-graph.component.css']
})
export class PopularInputsGraphComponent implements OnInit {
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
    const labels = this.stats.inputs
      .map(c => c.path)
      .splice(0, 10);
    return (this.reversed) ? labels.reverse() : labels;
  }

  buildDataSets() {
    const data = this.stats.inputs.map(s => s.count);
    const sets = [
      {
        data: (this.reversed) ? data.reverse() : data,
        label: 'Inputs'
      }
    ];
    return (this.reversed) ? sets.reverse() : sets;
  }
}

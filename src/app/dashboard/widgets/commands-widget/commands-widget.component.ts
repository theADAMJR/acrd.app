import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import pluginDataLabels from 'chartjs-plugin-datalabels';
import { GuildService } from 'src/app/services/guild.service';

@Component({
  selector: 'commands-widget',
  templateUrl: './commands-widget.component.html',
  styleUrls: ['./commands-widget.component.css']
})
export class CommandsWidgetComponent implements OnInit {
  commands: any;

  chartReady = false;
  
  barChartOptions: ChartOptions = {
    responsive: true,
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

  constructor(
    private guildService: GuildService,
    private route: ActivatedRoute) {}
    
  async ngOnInit() {
    this.route.paramMap.subscribe(async(val) => {
      const id = val.get('id');

      const log = await this.guildService.getSavedLog(id);
      this.commands = log.commands;
  
      this.barChartLabels = this.buildLabels();
      this.barChartData = this.buildDataSets();
      
      this.chartReady = true;
    });
  }

  buildLabels() {
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {		
      const date = new Date();
      date.setDate(date.getDate() - i);

      labels.push(this.ddMM(date));
    }    
    return labels;
  }

  buildDataSets() {
    const commonCommand = 'ping'; 

    const sets = [
      { data: [0,0,0,0,0,0,0], label: 'All' },
      { data: [0,0,0,0,0,0,0], label: commonCommand }];
      
    for (const command of this.commands) {
      const ddMM = this.ddMM(new Date(command.at));      
      const dayIndex = this.barChartLabels.indexOf(ddMM);

      sets[0].data[dayIndex]++;
      if (command.name === commonCommand)
        sets[1].data[dayIndex]++;
    }
    return sets;
  }

  private ddMM(date: Date) {
    return `${date.getDate()}/${(date.getMonth() + 1)}`;
  }
}

import { Component, OnInit } from '@angular/core';
import { GuildService } from 'src/app/services/guild.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'audit-log-widget',
  templateUrl: './audit-log-widget.component.html',
  styleUrls: ['./audit-log-widget.component.css']
})
export class AuditLogWidgetComponent implements OnInit {
  rows = 3;

  changeCount = 0;
  members: any[];
  changes: any[];

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async(val) => {
      const id = val.get('id');

      this.members = await this.guildService.getMembers(id);
  
      const { changes } = await this.guildService.getSavedLog(id);
      this.changeCount = changes.length;
      this.changes = changes.splice(changes.length - this.rows, changes.length);
    });
  }

  getMember(id: string) {          
    return this.members.find(m => m.id === id) || {};
  }
}

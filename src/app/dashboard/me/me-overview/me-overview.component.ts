import { Component } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { TabType } from '../friends-list/friends-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './me-overview.component.html',
  styleUrls: ['./me-overview.component.css']
})
export class DashboardOverviewComponent { 
  public tab: TabType = 'ONLINE';

  constructor(public dialog: DialogService) {
    document.title = 'Accord - Dashboard';

    this.tab = 'ONLINE';
  }
}
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendComponent } from 'src/app/dialog/add-friend/add-friend.component';
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
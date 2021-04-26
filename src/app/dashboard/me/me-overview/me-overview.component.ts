import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendComponent } from 'src/app/dialog/add-friend/add-friend.component';
import { TabType } from '../friends-list/friends-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './me-overview.component.html',
  styleUrls: ['./me-overview.component.css']
})
export class DashboardOverviewComponent { 
  public tab: TabType = 'ONLINE';

  constructor(private dialog: MatDialog) {
    document.title = 'Accord - Dashboard';

    this.tab = 'ONLINE';
  }

  public addFriendDialog() {
    this.dialog.open(AddFriendComponent, {
      width: '350px',
      data: {},
    });
  }
}
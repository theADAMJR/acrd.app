import { Component } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { DialogService } from 'src/app/services/dialog.service';
import { environment } from 'src/environments/environment';
import { TabType } from '../friends-list/friends-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './me-overview.component.html',
  styleUrls: ['./me-overview.component.css']
})
export class DashboardOverviewComponent { 
  public tab: TabType = 'ONLINE';

  constructor(
    public config: ConfigService,
    public dialog: DialogService,
  ) {
    document.title = 'Accord - Dashboard';

    this.tab = 'ONLINE';

    const hasUpdated = this.config.getValue('lastReadChangelog') !== environment.version;
    if (hasUpdated)
      this.dialog.changelog();
  }
}
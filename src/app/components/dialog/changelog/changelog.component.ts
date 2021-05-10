import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent {
  public version = environment.version;

  constructor(
    private config: ConfigService,
    private dialogRef: MatDialogRef<ChangelogComponent>,
  ) {}

  public ok() {
    this.dialogRef.close();
    this.config.set('lastReadChangelog', environment.version);
  }
}

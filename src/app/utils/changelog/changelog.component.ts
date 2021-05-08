import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { setConfig } from 'src/app/config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent {
  public version = environment.version;

  constructor(
    private dialogRef: MatDialogRef<ChangelogComponent>,
  ) {}

  public ok() {
    this.dialogRef.close();
    setConfig('lastReadChangelog', environment.version);
  }
}

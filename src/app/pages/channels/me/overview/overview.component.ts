import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/api/user.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
  constructor(
    public dialog: DialogService,
    public userService: UserService,
  ) {}
}

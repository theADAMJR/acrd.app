import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/api/user.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-theme-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent {  
  constructor(public userService: UserService) {}
}

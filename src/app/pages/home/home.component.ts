import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  version = environment.version;

  constructor() {
    document.title = 'Accord - Like Discord, But Customizable';
  }
}

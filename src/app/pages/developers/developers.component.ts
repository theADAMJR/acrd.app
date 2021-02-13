import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevelopersService } from 'src/app/services/developers.service';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {
  applications = [];

  constructor(
    private router: Router,
    private service: DevelopersService,
  ) {}

  async ngOnInit() {
    this.applications = await this.service.getAll();
  }

  async create() {
    try {
      const app = await this.service.create();
      
      await this.router.navigate([`/developers/applications/`, app?._id]);
    } catch (apiError) {
      alert(apiError.message);
    }
  }
}

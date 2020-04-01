import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'save-changes',
  templateUrl: './save-changes.component.html',
  styleUrls: ['./save-changes.component.css']
})
export class SaveChangesComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
  }

  reset() {
    this.close();
  }

  save() {
    this.close();
  }

  close() {
    this.snackBar.dismiss();
  }
}

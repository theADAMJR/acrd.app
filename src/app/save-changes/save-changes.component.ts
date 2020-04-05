import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'save-changes',
  templateUrl: './save-changes.component.html',
  styleUrls: ['./save-changes.component.css']
})
export class SaveChangesComponent implements OnInit {
  @Output() onReset = new EventEmitter();
  @Output() onSave = new EventEmitter();

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
  }

  reset() {
    this.onReset.emit();
    this.close();
  }

  save() {
    this.onSave.emit();
    this.close();
  }

  close() {
    this.snackBar.dismiss();
    
    this.onReset.unsubscribe();
    this.onSave.unsubscribe();
  }
}

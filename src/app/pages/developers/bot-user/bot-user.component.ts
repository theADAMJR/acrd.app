import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SaveChangesComponent } from 'src/app/dashboard/components/save-changes/save-changes.component';
import { DevelopersService } from 'src/app/services/developers.service';
import { Lean, patterns } from 'src/app/types/entity-types';

@Component({
  selector: 'app-bot-user',
  templateUrl: './bot-user.component.html',
  styleUrls: ['../application/application.component.css', '../developers.component.css']
})
export class BotUserComponent implements OnInit {
  form = new FormGroup({
    avatarURL: new FormControl('', [ Validators.required ]),
    username: new FormControl('', [ Validators.required, Validators.pattern(patterns.username) ]),
  });

  originalForm: Lean.Application;
  app: Lean.Application;

  private saveChanges$: Subscription;  
  private valueChanges$: Subscription;  

  constructor(
    private route: ActivatedRoute,
    public saveChanges: MatSnackBar,
    private service: DevelopersService,
  ) {}

  async ngOnInit() {
    const appId = this.route.snapshot.paramMap.get('id');
    this.app = await this.service.get(appId);
    this.form.setValue({
      description: this.app.description,
      name: this.app.name,
    });
    this.originalForm = { ...this.form.value };

    this.valueChanges$ = this.form.valueChanges
      .subscribe(() => this.openSaveChanges()); 
  }

  ngOnDestroy() {    
    this.valueChanges$?.unsubscribe();
    this.saveChanges$?.unsubscribe();
  }
  
  openSaveChanges() {
    const snackBarRef = this.saveChanges._openedSnackBarRef;
    if (!this.form.valid || snackBarRef) return;

    this.saveChanges$ = this.saveChanges
      .openFromComponent(SaveChangesComponent)
      .afterOpened()
      .subscribe(() => {
        const component = this.saveChanges._openedSnackBarRef.instance as SaveChangesComponent;
        if (!component) return;

        component.onSave.subscribe(async() => await this.submit());
        component.onReset.subscribe(async() => await this.reset());
      });    
  }

  async submit() {
    try {
      if (!this.form.valid) return;

      await this.service.update(this.app._id, this.form.value);
      this.originalForm = { ...this.form.value };  
    } catch {
      alert('An error occurred when submitting the form - check console');
    }
  }

  async reset() {
    this.form.setValue({ ...this.originalForm });
    
    this.valueChanges$ = this.form.valueChanges
      .subscribe(() => this.openSaveChanges()); 
  }
}

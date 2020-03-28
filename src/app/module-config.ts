import { AuthService } from './auth.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

export abstract class ModuleConfig implements OnInit {
    abstract form: FormGroup;

    unsaved = false;
    guild: any;
    savedGuild: any;
  
    constructor(
        private auth: AuthService,
        private route: ActivatedRoute) {}

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.guild = await this.auth.getGuild(id);
        this.savedGuild = await this.auth.getSavedGuild(id);
        
        this.form.valueChanges
            .subscribe(value => this.onChange());
    }

    onChange() {
        if (this.unsaved) return;
        this.unsaved = true;
        console.log();
        
        setTimeout(() => {
            const shouldSave = confirm('Would you like to save?');
            if (shouldSave)
                this.onSubmit(this.form.value);
            this.unsaved = false;
        }, 3000);
    }

    onSubmit(value: any) {
      alert('submit');
      console.log(value);
      
    }
}
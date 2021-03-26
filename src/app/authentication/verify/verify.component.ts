import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  public processing = false;

  public form = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(7),
    ])
  });

  constructor(
    private authService: UserAuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public async ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.form.get('code').setValue(code);
      await this.submit();
    }
  }

  public async submit() {
    try {
      if (this.form.invalid) return;
  
      const code = this.form.get('code').value;
      const key = await this.authService.verify(code);
      localStorage.setItem('key', key);

      await this.router.navigate(['/channels/@me']);
    } catch (error) {
      this.form.setErrors({ invalidCode: error.message });
    }
  }
}

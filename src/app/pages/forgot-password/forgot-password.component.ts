import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from 'src/app/services/api/user-auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public processing = false;
  public sent = false;

  public form = new FormGroup({
    email: new FormControl('', Validators.email),
  });

  constructor(
    private route: ActivatedRoute,
    private auth: UserAuthService,
  ) {}

  public ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    this.form.get('email').setValue(email);
  }

  public async send() {
    const email = this.form.get('email').value;
    if (!email || this.form.invalid) return;

    this.processing = this.sent = true;
    await this.auth.sendVerifyEmail(email, 'FORGOT_PASSWORD');
    this.processing = false;
  }
}

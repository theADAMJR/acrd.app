import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, XPCard } from '../services/user.service';

@Component({
  selector: 'customize-xp-card',
  templateUrl: './customize-xp-card.component.html',
  styleUrls: ['./customize-xp-card.component.css']
})
export class CustomizeXPCardComponent implements OnInit {
  colors = {
      primary: '#F4F2F3',
      secondary: '#46828D',
      tertiary: '#36E2CA'
  }

  xpCardPreviewURL: string;

  get savedUser() { return this.userService.savedUser || {}; }

  get primary() { return this.form.get('primary'); }
  get secondary() { return this.form.get('secondary'); }
  get tertiary() { return this.form.get('tertiary'); }
  get backgroundURL() { return this.form.get('backgroundURL'); }

  form = new FormGroup({
    primary: new FormControl(''),
    secondary: new FormControl(''),
    tertiary: new FormControl(''),
    backgroundURL: new FormControl('', Validators.required)
  });

  constructor(
    private userService: UserService) {}

  async ngOnInit() {
    this.form.valueChanges.subscribe(() => this.updatePreview());
    this.updatePreview();

    this.initFormValues();
  }

  initFormValues() {
    this.primary.setValue(this.savedUser.primary ?? this.colors.primary);
    this.secondary.setValue(this.savedUser.secondary ?? this.colors.secondary);
    this.tertiary.setValue(this.savedUser.tertiary ?? this.colors.tertiary);
    this.backgroundURL.setValue(this.savedUser.backgroundURL);
  }

  async submit(form: XPCard) {
    await this.userService.updateXPCard(form);
  }

  updatePreview() {    
    const primary = this.hexToRGB(this.primary.value);
    const secondary = this.hexToRGB(this.secondary.value );  
    const tertiary = this.hexToRGB(this.tertiary.value);  
    const backgroundURL = this.hexToRGB(this.backgroundURL.value);  

    this.xpCardPreviewURL = this.userService.getXPCardPreviewURL(
      { primary, secondary, tertiary, backgroundURL });
  }

  private hexToRGB(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result)
      return '';
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r},${g},${b})`;
  }
}

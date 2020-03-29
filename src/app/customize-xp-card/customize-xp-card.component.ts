import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'customize-xp-card',
  templateUrl: './customize-xp-card.component.html',
  styleUrls: ['./customize-xp-card.component.css']
})
export class CustomizeXPCardComponent implements OnInit {
  xpCardPreviewURL: string;

  get savedUser() { return this.auth.savedUser; }

  form = new FormGroup({
    primary: new FormControl(''),
    secondary: new FormControl(''),
    tertiary: new FormControl(''),
    backgroundURL: new FormControl('')
  });

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    this.form.valueChanges.subscribe(() => this.updatePreview());
    this.updatePreview();
  }

  submit(value: any) {
    // send
    console.log(value);    
  }

  updatePreview() {    
    const primary = this.hexToRGB(this.form.get('primary').value);
    const secondary = this.hexToRGB(this.form.get('secondary').value);  
    const tertiary = this.hexToRGB(this.form.get('tertiary').value);  
    const backgroundURL = this.hexToRGB(this.form.get('backgroundURL').value);  

    this.xpCardPreviewURL = this.auth.getXPCardPreviewURL({ primary, secondary, tertiary, backgroundURL });
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

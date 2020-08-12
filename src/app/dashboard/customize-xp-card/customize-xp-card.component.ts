import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, XPCard } from '../../services/user.service';

@Component({
  selector: 'customize-xp-card',
  templateUrl: './customize-xp-card.component.html',
  styleUrls: ['./customize-xp-card.component.css']
})
export class CustomizeXPCardComponent implements OnInit {
  @Output() xpCardUpdate = new EventEmitter();

  stockImages = [
    'https://cdn.pixabay.com/photo/2016/09/04/22/07/flames-1645399_960_720.jpg',
    'https://cdn.pixabay.com/photo/2020/03/31/11/59/sunrise-4987384_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/03/04/19/36/beach-1236581_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/02/13/12/26/aurora-1197753_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/11/27/12/50/purple-1862798__340.jpg',
    'https://cdn.pixabay.com/photo/2016/07/25/12/48/turquoise-1540436_960_720.png',
    'https://cdn.pixabay.com/photo/2017/09/26/22/27/mosaic-2790344_960_720.png',
    'https://cdn.pixabay.com/photo/2016/05/22/20/13/background-1409125_960_720.png'
  ]
  colors = {
      primary: '#F4F2F3',
      secondary: '#46828D',
      tertiary: '#36E2CA'
  }
  colorPickers = [];

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
    await this.userService.init();

    this.initFormValues();
    this.updatePreview();
  }

  initFormValues() {
    const xpCard = this.savedUser.xpCard;
    this.colorPickers = [
      xpCard.primary ?? this.colors.primary,
      xpCard.secondary ?? this.colors.secondary,
      xpCard.tertiary ?? this.colors.tertiary
    ];    
    this.backgroundURL.setValue(xpCard.backgroundURL);
  }

  async submit(form: XPCard) {    
    await this.userService.updateXPCard(form);
    this.xpCardUpdate.emit();
  }

  updatePreview() {    
    this.setValues();

    const primary = this.hexToRGB(this.primary.value);
    const secondary = this.hexToRGB(this.secondary.value);  
    const tertiary = this.hexToRGB(this.tertiary.value);  
    const backgroundURL = this.backgroundURL.value;
    
    this.xpCardPreviewURL = this.userService.getXPCardPreviewURL(
      { primary, secondary, tertiary, backgroundURL });
  }
  private setValues() {    
    this.primary.setValue(this.colorPickers[0]);
    this.secondary.setValue(this.colorPickers[1]);
    this.tertiary.setValue(this.colorPickers[2]);
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

  setBackground(url: string) {
    this.backgroundURL.setValue(url);
    this.updatePreview();
  }
}

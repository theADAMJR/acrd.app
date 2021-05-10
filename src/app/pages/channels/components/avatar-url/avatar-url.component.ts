import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Lean } from 'src/app/types/entity-types';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-avatar-url',
  templateUrl: './avatar-url.component.html',
  styleUrls: ['./avatar-url.component.css']
})
export class AvatarUrlComponent implements AfterViewInit {
  @Input() public user: Lean.User;
  @Input() public size = '32px';

  @ViewChild('img')
  private img: ElementRef;

  private unknownImageURL = `${environment.endpoint}/avatars/unknown.png`;

  public ngAfterViewInit() {
    const image = this.img.nativeElement as HTMLImageElement;
    image.onerror = () => image.src = this.unknownImageURL; 
  }
}

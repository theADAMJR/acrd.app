import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { GuildService } from 'src/app/services/guild.service';
import { UserService } from 'src/app/services/user.service';
import { Lean } from 'src/app/types/entity-types';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guild-icon',
  templateUrl: './guild-icon.component.html',
  styleUrls: ['./guild-icon.component.css']
})
export class GuildIconComponent implements AfterViewInit {
  @Input() public guild: Lean.Guild;
  @Input() public size = '52px';

  @ViewChild('img')
  private img: ElementRef;

  private unknownImageURL = `${environment.endpoint}/avatars/unknown.png`;

  constructor(
    public dialogs: DialogService,
    public guildService: GuildService,
    public userService: UserService,
  ) {}

  public ngAfterViewInit() {
    const image = this.img?.nativeElement as HTMLImageElement;
    if (image)
      image.onerror = () => image.src = this.unknownImageURL; 
  }
}

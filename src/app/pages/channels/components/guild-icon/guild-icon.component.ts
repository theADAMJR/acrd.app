import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { DialogService } from 'src/app/services/dialog.service';
import { GuildService } from 'src/app/services/api/guild.service';
import { PingService } from 'src/app/services/ping.service';
import { UserService } from 'src/app/services/api/user.service';
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

  public get fontSize() {
    return `calc(${this.size}/3)`;
  }

  constructor(
    public config: ConfigService,
    public dialog: DialogService,
    public pings: PingService,
    public guildService: GuildService,
    public userService: UserService,
  ) {}

  public ngAfterViewInit() {
    const image = this.img?.nativeElement as HTMLImageElement;
    if (image)
      image.onerror = () => image.src = this.unknownImageURL; 
  }
}

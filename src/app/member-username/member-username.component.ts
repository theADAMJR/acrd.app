import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'member-username',
  templateUrl: './member-username.component.html',
  styleUrls: ['./member-username.component.css']
})
export class MemberUsernameComponent implements OnInit {
  @Input() user;
  @Input() guild;
  @Input() withAvatar = true;
  @Input() voice = false;

  @Output() memberKick = new EventEmitter<any>();

  private menu: HTMLDivElement;

  async ngOnInit() {
    this.menu = document.querySelector('.ctx-member-menu');
  }  

  openCtxMenu($event) {
    if (!this.guild) return;

    const target = $event.target as HTMLElement;
    const clickedOnUsername = target.classList?.contains('member-username')
      || target.classList?.contains('username');
    if (!clickedOnUsername) return;
    
    $event.preventDefault();

    this.setPosition($event);
    this.setContext();
    this.toggleMenu();
  }

  private setContext() { 
    this.menu.innerHTML = this.menu.innerHTML.replace(/Kick .*$/, `Kick ${this.user.username}`);
  }

  private setPosition($event) {
    const offsetX = 350;

    this.menu.style.top = `${$event.pageY}px`;
    this.menu.style.left = `${$event.pageX - offsetX}px`;
  }

  private toggleMenu() {
    this.menu.style.display = this.menu.style.display === 'none'
      ? 'block'
      : 'none';    
  }
}

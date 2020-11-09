import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

declare var $: any; // ADD THIS

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
  @Input() statusOverride: string;

  @Output() memberKick = new EventEmitter<any>();

  get member() {
    return this.guild?.members.find(m => m.user._id === this.user._id);
  }
  get roleColor() {
    if (!this.guild) return null;

    const roleId = this.member.roleIds[this.member.roleIds.length - 1];
    return this.guild.roles.find(r => r._id == roleId)?.color;
  }
  get roles() {
    if (!this.guild) return null;
    
    return this.guild.roles
      .filter(r => this.member.roleIds.includes(r._id));
  }
  get popoverHTML() {
    return (!this.member)
      ? ``
      : `<select class="form-control" multiple>
        <option value="">Test</option>
      </select>`;
  }

  private menu: HTMLDivElement;

  async ngOnInit() {
    this.menu = document.querySelector('.ctx-member-menu');

    $('[data-toggle="popover"]').popover({ html: true, content: this.popoverHTML });
  } 
  
  openPopover() {
    setTimeout(() => {
      $('.popover-body').html(`
      <select class="selectpicker" multiple>
        ${this.roles?.map(r => `<option>${r.name}</option>`)}
      </select>`)
    }, 100);
  }

  openCtxMenu(event) {
    if (!this.guild) return;

    const target = event.target as HTMLElement;
    const clickedOnUsername = target.classList?.contains('member-username')
      || target.classList?.contains('username');
    if (!clickedOnUsername) return;
    
    event.preventDefault();

    this.setPosition(event);
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

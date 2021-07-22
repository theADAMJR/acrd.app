import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import GuildIcon from './guild-icon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './sidebar-icons.scoped.css';

export interface SidebarIconsProps {
  user: Entity.User;
  guilds: Entity.Guild[];
}
 
export interface SidebarIconsState {}
 
class SidebarIcons extends React.Component<SidebarIconsProps, SidebarIconsState> {
  get guildIcons() {
    return this.props.guilds
      .map(g => <GuildIcon key={g.id} guild={g}></GuildIcon>);
  }

  get userAvatar() {
    const user = this.props.user;
    return this.iconify(
      <img className="cursor-pointer h-12 w-12 rounded-full" src={user.avatarURL} alt={user.username} />
    );
  }

  get plusIcon() {
    return this.iconify(
      <div className="flex items-center justify-center rounded-full h-12 w-12 background-primary color-success text-4xl font-light pb-1">+</div>
    );
  }

  render() { 
    return (
      <div className="sidebar-icons flex flex-col background-tertiary px-2">
        {this.iconify(this.userAvatar)}
        {this.iconify(<div className="icon-separator mb-1"></div>)}
        {this.guildIcons}
        {this.plusIcon}
      </div>
    );
  }

  private iconify(content: JSX.Element) {
    return (
      <div className="guild-icon flex justify-center mb-1">{content}</div>
    );
  }
}
 
export default SidebarIcons;
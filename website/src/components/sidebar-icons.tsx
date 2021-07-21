import * as React from 'react';
import './sidebar-icons.css';

export interface SidebarIconsProps {
  guilds: Entity.Guild[];
}
 
export interface SidebarIconsState {}
 
class SidebarIcons extends React.Component<SidebarIconsProps, SidebarIconsState> {
  get guildIcons() {
    return this.props.guilds
      .map(g => <span className="icon">{g.name.slice(0, 3)}</span>);
  }

  render() { 
    return (
      <div className="sidebar-icons background-tertiary">
        {this.guildIcons}
      </div>
    );
  }
}
 
export default SidebarIcons;
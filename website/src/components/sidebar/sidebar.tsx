import { Component } from 'react';
import SidebarFooter from './sidebar-footer/sidebar-footer';
import './sidebar.css';

export interface SidebarProps {
  
}
 
export interface SidebarState {
  guilds: Entity.Guild[];
}

class Sidebar extends Component<SidebarProps, SidebarState> {
  state = {
    guilds: [
      {
        id: '123',
        name: 'epic guild',
        iconURL: '',
        ownerId: '123',
      }
    ]
  }

  get guildIcons() {
    return this.state.guilds.map(g => (
      <div className="guild-icon">{g.name}</div>
    ));
  }

  render() { 
    return (
      <div className="sidebar">
        <div className="sidebar-icons">
          {this.guildIcons}
        </div>
        <div className="sidebar-content">
          {/* imported */}
        </div>
        <SidebarFooter></SidebarFooter>
      </div>
    );
  }
}
 
export default Sidebar;
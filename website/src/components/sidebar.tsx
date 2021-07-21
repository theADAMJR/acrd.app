import { Component } from 'react';
import { temp } from '../../../utils/src/utils/temp';
import SidebarFooter from './sidebar-footer';
import './sidebar.css';

export interface SidebarProps {
  
}
 
export interface SidebarState {
  guilds: Entity.Guild[];
}

class Sidebar extends Component<SidebarProps, SidebarState> {
  render() { 
    return (
      <div className="sidebar">
        <div guilds={temp.guilds} className="sidebar-icons">
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
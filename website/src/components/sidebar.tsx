import { Component } from 'react';
import { temp } from '../utils/src/temp';
import SidebarFooter from './sidebar-footer';
import SidebarIcons from './sidebar-icons';

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
        <SidebarIcons guilds={temp.guilds}></SidebarIcons>
        <div className="sidebar-content">
          {/* imported */}
        </div>
        <SidebarFooter></SidebarFooter>
      </div>
    );
  }
}
 
export default Sidebar;
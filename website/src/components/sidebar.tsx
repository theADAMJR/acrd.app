import { Component } from 'react';
import { temp } from '../utils/src/temp';
import SidebarContent from './sidebar-content';
import SidebarIcons from './sidebar-icons';

import './sidebar.css';

export interface SidebarProps {}
export interface SidebarState {
  guilds: Entity.Guild[];
}

class Sidebar extends Component<SidebarProps, SidebarState> {
  render() { 
    return (
      <div className="sidebar flex">
        <SidebarIcons user={temp.users[0]} guilds={temp.guilds} />
        <SidebarContent guild={temp.guilds[0]} />
      </div>
    );
  }
}
 
export default Sidebar;
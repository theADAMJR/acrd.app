import { Component } from 'react';
import store from '../redux/store';
import SidebarContent from './sidebar-content';
import SidebarIcons from './sidebar-icons';

import './sidebar.scoped.css';

export interface SidebarProps {}
export interface SidebarState {
  guilds: Entity.Guild[];
}
 
const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  let state = store.getState();
  store.subscribe(() => state = store.getState());

  return (
    <div className="sidebar flex">
      <SidebarIcons user={state.selfUser} guilds={state.guilds} />
      <SidebarContent guild={state.activeGuild} />
    </div>
  );
}
 
export default Sidebar;

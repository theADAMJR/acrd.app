import * as React from 'react';
import { temp } from '../../../utils/src/utils/temp';

export interface SidebarIconsProps {
  guilds: Entity.Guild[];
}
 
export interface SidebarIconsState {
  
}
 
class SidebarIcons extends React.Component<SidebarIconsProps, SidebarIconsState> {
  state = { guilds: temp.guilds };

  get guildIcons() {
    return this.state.guilds
      .map(g => <span className="icon">{g.name.slice(0, 3)}</span>);
  }

  render() { 
    return (
      <div className="sidebar-icons">
        {this.guildIcons}
      </div>
    );
  }
}
 
export default SidebarIcons;
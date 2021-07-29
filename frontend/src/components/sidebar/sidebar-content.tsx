import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import './sidebar-content.scoped.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SidebarFooter from './sidebar-footer';

export interface SidebarContentProps {
  user: Entity.User;
}

const SidebarContent: React.FunctionComponent<SidebarContentProps> = (props) => {  
  return (
    <div className="flex flex-col sidebar-content background-secondary">
      <div className="sidebar-header">
        <div className="inline-flex justify-content-between">
          <h1 className="flex-grow font-bold">{state.activeGuild?.name}</h1>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div className="sidebar-details flex-grow"></div>
      <SidebarFooter user={props.user} />
    </div>
  );
}
 
export default SidebarContent;
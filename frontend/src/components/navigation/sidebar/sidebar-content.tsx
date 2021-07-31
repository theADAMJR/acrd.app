import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import SidebarFooter from './sidebar-footer';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropdown from '../../utils/dropdown';

import './sidebar-content.scoped.css';

const SidebarContent: React.FunctionComponent = () => {  
  const ui = useSelector((s: Store.AppStore) => s.ui);
  
  const channels = ui.activeGuild?.channels.map(c => (
    <Link
      style={{height: '34px'}}
      to={`/channels/${ui.activeGuild!.id}/${c.id}`}
      className={`
        cursor-pointer flex items-center rounded p-2 pl-3
        ${c.id === ui.activeChannel?.id && 'active'}`}>
      <FontAwesomeIcon
        className="float-left mr-2 scale-150 muted fill-current"
        icon={faHashtag} />
      <span>{c.name}</span>
    </Link>
  ));
  
  // guild sidebar content
  return (
    <div className="flex flex-col sidebar-content bg-bg-secondary">
      <div className="sidebar-header pl-2.5 pr-4">
        {ui.activeGuild && (
          <Dropdown title={ui.activeGuild.name}>
            
          </Dropdown>
        )}
      </div>
      <div className="sidebar-details flex-grow px-2">
        <div className="h-4" />
        {channels}
      </div>
      <SidebarFooter />
    </div>
  );
}
 
export default SidebarContent;
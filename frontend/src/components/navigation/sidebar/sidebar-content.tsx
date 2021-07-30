import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import './sidebar-content.scoped.css';
import { faChevronDown, faHashtag } from '@fortawesome/free-solid-svg-icons';
import SidebarFooter from './sidebar-footer';
import { useSelector, useStore } from 'react-redux';
import { Link } from 'react-router-dom';

const SidebarContent: React.FunctionComponent = (props) => {  
  const ui = useSelector((s: Store.AppStore) => s.ui);

  const channels = ui.activeGuild?.channels.map(c => (
    <Link
      to={`/channels/${ui.activeGuild!.id}/${c.id}`}
      className="cursor-pointer flex items-center">
      <FontAwesomeIcon
        className={`float-left mr-1 scale-150 ${c.id === ui.activeChannel?.id && 'active'}`}
        icon={faHashtag} />
      <span className="text-lg">{c.name}</span>
    </Link>
  ));
  
  return (
    <div className="flex flex-col sidebar-content bg-bg-secondary">
      <div className="sidebar-header">
        <div className="inline-flex justify-content-between">
          {ui.activeGuild && (<>
            <h1 className="flex-grow font-bold">{ui.activeGuild.name}</h1>
            <FontAwesomeIcon icon={faChevronDown} />
          </>)}
        </div>
      </div>
      <div className="sidebar-details flex-grow">{channels}</div>
      <SidebarFooter />
    </div>
  );
}
 
export default SidebarContent;
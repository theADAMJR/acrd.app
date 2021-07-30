import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import './sidebar-content.scoped.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SidebarFooter from './sidebar-footer';
import { useSelector, useStore } from 'react-redux';

const SidebarContent: React.FunctionComponent = (props) => {  
  const ui = useSelector((s: Store.AppStore) => s.ui);
  
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
      <div className="sidebar-details flex-grow"></div>
      <SidebarFooter />
    </div>
  );
}
 
export default SidebarContent;
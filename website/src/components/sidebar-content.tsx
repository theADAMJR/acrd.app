import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import './sidebar-content.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SidebarFooter from './sidebar-footer';

export interface SidebarContentProps {
  guild?: Entity.Guild;
}
 
export interface SidebarContentState {}
 
class SidebarContent extends React.Component<SidebarContentProps, SidebarContentState> {
  get guildContent() {
    return (
      <div className="flex flex-col sidebar-content background-secondary">
        <div className="sidebar-header">
          <div className="inline-flex justify-content-between">
            <h1 className="flex-grow font-bold">{this.props.guild?.name}</h1>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        <div className="sidebar-details flex-grow">

        </div>
        <SidebarFooter />
      </div>
    );
  }

  get userContent() {
    return (
      <></>
    );
  }

  render() { 
    return (this.props.guild)
      ? this.guildContent
      : this.userContent;
  }
}
 
export default SidebarContent;
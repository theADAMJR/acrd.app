import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import './sidebar-content.css';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export interface SidebarContentProps {
  guild?: Entity.Guild;
}
 
export interface SidebarContentState {}
 
class SidebarContent extends React.Component<SidebarContentProps, SidebarContentState> {
  get guildContent() {
    return (
      <div className="sidebar-content background-secondary">
        <div className="sidebar-header">
          <div className="d-inline-flex justify-content-between">
          < h1>{this.props.guild?.name}</h1>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
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
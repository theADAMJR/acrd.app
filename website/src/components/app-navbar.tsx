import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import './app-navbar.css';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHashtag, faAt } from '@fortawesome/free-solid-svg-icons';

export interface AppNavbarProps {
  guild?: Entity.Guild;
  channel?: Entity.Channel;
}
export interface AppNavbarState {}
 
class AppNavbar extends React.Component<AppNavbarProps, AppNavbarState> {
  state = {};

  get titleIcon(): IconProp {
    return (this.props.guild)
      ? faHashtag
      : faAt;
  }

  render() { 
    return (
      <div className="app-navbar">
        <FontAwesomeIcon icon={this.titleIcon} />
        <h3>{this.props.channel?.name}</h3>
      </div>
    );
  }
}
 
export default AppNavbar;
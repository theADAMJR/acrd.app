import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { useStore } from 'react-redux';
import './app-navbar.scoped.css';
 
const AppNavbar: React.FunctionComponent = () => {
  const state = useStore().getState();

  const title = state.ui.activeChannel?.name
    ?? state.io.activeGuild?.name;
  return (
    <div className="app-navbar">
      <FontAwesomeIcon icon={faHashtag} />
      <h3>{title}</h3>
    </div>
  );
}
 
export default AppNavbar;
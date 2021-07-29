import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useStore } from 'react-redux';
import './app-navbar.scoped.css';
 
const AppNavbar: React.FunctionComponent = () => {
  const ui = useSelector((s: Store.AppStore) => s.ui);

  const title = ui.activeChannel?.name ?? ui.activeGuild?.name;
  return (
    <div className="app-navbar">
      <FontAwesomeIcon icon={faHashtag} />
      <h3>{title}</h3>
    </div>
  );
}
 
export default AppNavbar;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import './app-navbar.scoped.css';
 
const AppNavbar: React.FunctionComponent = () => {
  const ui = useSelector((s: Store.AppStore) => s.ui);

  return (
    <div className="app-navbar flex items-center px-5">
      {ui.activeChannel && <FontAwesomeIcon
        icon={faHashtag}
        className="scale-150 mr-2" />}
      <h3 className="font-bold">{ui.activeChannel?.name}</h3>
    </div>
  );
}
 
export default AppNavbar;
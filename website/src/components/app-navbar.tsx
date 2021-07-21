import * as React from 'react';

export interface AppNavbarProps {
  
}
 
export interface AppNavbarState {
  
}
 
class AppNavbar extends React.Component<AppNavbarProps, AppNavbarState> {
  state = {};

  render() { 
    return (
      <div className="app-navbar">App Navbar</div>
    );
  }
}
 
export default AppNavbar;
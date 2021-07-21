import * as React from 'react';
import './username.css';

export interface UsernameProps {
  user: Entity.User;
}
 
export interface UsernameState {}
 
class Username extends React.Component<UsernameProps, UsernameState> {
  render() { 
    return (
      <div className="username">
        <h4>{this.props.user.username}</h4>
      </div>
    );
  }
}
 
export default Username;
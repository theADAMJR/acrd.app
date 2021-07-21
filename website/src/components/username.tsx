import * as React from 'react';
import './username.css';

export interface UsernameProps {
  user: Entity.User;
  guild?: Entity.Guild;
}
 
export interface UsernameState {}
 
class Username extends React.Component<UsernameProps, UsernameState> {
  render() {
    const user = this.props.user; 
    return (
      <div className="username flex p-3">
        <div className="avatar mr-2">
          <img className="rounded-full" src={user.avatarURL} />
        </div>
        <div className="tag leading-4">
          <h4 className="font-bold">{user.username}</h4>
          <div className="discriminator text-xs">#{user.discriminator}</div>
        </div>
      </div>
    );
  }
}
 
export default Username;
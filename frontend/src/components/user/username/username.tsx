import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import './username.scoped.css';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

export interface UsernameProps {
  user: Entity.User;
  guild?: Entity.Guild;
}
 
const Username: React.FunctionComponent<UsernameProps> = ({ guild, user }) => {
  const userOwnsGuild = guild?.ownerId === user.id;

  return (
    <div className="username flex p-3">
      <div className="avatar mr-2">
        <img className="rounded-full" src={user.avatarURL} />
      </div>
      <div className="tag leading-4">
        <h4 className="font-bold">
          <span>{user.username}</span>
          <span className="text-yellow-400 ml-1">
            {userOwnsGuild && <FontAwesomeIcon icon={faCrown} />}
          </span>
        </h4>
        <div className="discriminator text-xs">#{user.discriminator}</div>
      </div>
    </div>
  );
}
 
export default Username;
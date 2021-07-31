import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './username.scoped.css';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import environment from '../../../environment';

export interface UsernameProps {
  user: Entity.User;
  guild?: Entity.Guild;
}
 
const Username: React.FunctionComponent<UsernameProps> = ({ guild, user }) => {
  const userOwnsGuild = guild?.ownerId === user.id;
  const paddedDiscrim = user.discriminator
    .toString()
    .padStart(4, '0');

  return (
    <div className="username flex p-3">
      <div className="avatar mr-2">
        <img className="rounded-full" src={`${environment.rootAPIURL}${user.avatarURL}`} />
      </div>
      <div className="tag leading-4">
        <h4 className="font-bold">
          <span>{user.username}</span>
          <span className="text-yellow-400 ml-1">
            {userOwnsGuild && <FontAwesomeIcon icon={faCrown} />}
          </span>
        </h4>
        <div className="discriminator text-xs">#{paddedDiscrim}</div>
      </div>
    </div>
  );
}
 
export default Username;
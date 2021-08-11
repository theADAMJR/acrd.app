import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import environment from '../../environment';

export interface UsernameProps {
  user: Entity.User;
  guild?: Entity.Guild;
}
 
const Username: React.FunctionComponent<UsernameProps> = ({ guild, user }) => {
  const userOwnsGuild = guild?.ownerId === user.id;
  const discrim = user.discriminator
    .toString()
    .padStart(4, '0');

  return (
    <div className="flex items-center px-2">
      <div className="avatar mr-2">
        <img
          className="select-none rounded-full w-8 h-8"
          src={`${environment.rootAPIURL}${user.avatarURL}`} />
      </div>
      <div className="tag leading-4">
        <h4 className="font-bold text-sm">
          <span className={guild && 'font-light secondary text-base'}>{user.username}</span>
          <span className="text-yellow-400 ml-1">
            {userOwnsGuild && <FontAwesomeIcon icon={faCrown} />}
          </span>
        </h4>
        {!guild && <div className="discriminator text-xs">#{discrim}</div>}
      </div>
    </div>
  );
}
 
export default Username;
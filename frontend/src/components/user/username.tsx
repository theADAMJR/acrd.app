import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import environment from '../../environment';
import { getMemberHighestRole } from '../../store/roles';
import { useSelector } from 'react-redux';

export interface UsernameProps {
  user: Entity.User;
  guild?: Entity.Guild;
}
 
const Username: React.FunctionComponent<UsernameProps> = ({ guild, user }) => {
  const highestRole = useSelector(getMemberHighestRole(guild?.id, user.id));

  const userOwnsGuild = guild?.ownerId === user.id;
  const discrim = user.discriminator
    .toString()
    .padStart(4, '0');
  const isOnline = user.status === 'ONLINE';

  return (
    <div className={`flex items-center px-2 ${!isOnline && 'opacity-50'}`}>
      <div className="relative avatar mr-2">
        <span className="rounded-full absolute flex -right-0.5 -bottom-0.5">
          <span
            style={{ border: '2px solid var(--bg-secondary)' }}
            className={`relative inline-flex rounded-full px-1 h-3.5 w-3.5 ${isOnline ? 'bg-success' : 'bg-gray-500'}`} />
        </span>
        <img
          className="select-none rounded-full w-8 h-8"
          src={`${environment.cdnURL}${user.avatarURL}`} />
      </div>
      <div className="tag leading-4">
        <h4 className="font-bold text-sm">
          <span
            style={{ color: highestRole?.color ?? 'var(--secondary)' }}
            className={guild && 'font-light text-base'}>{user.username}</span>
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
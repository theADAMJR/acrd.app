import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { getMemberHighestRole } from '../../store/roles';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Image from '../utils/image';

export interface UsernameProps {
  user: Entity.User;
  guild?: Entity.Guild;
  size?: 'md' | 'lg';
}
 
const Username: React.FunctionComponent<UsernameProps> = ({ guild, user, size = 'md' }) => {
  const highestRole = useSelector(getMemberHighestRole(guild?.id, user.id));

  const userOwnsGuild = guild?.ownerId === user.id;
  const discrim = user.discriminator
    .toString()
    .padStart(4, '0');
  const isOnline = user.status === 'ONLINE';

  const UserPresence = () => {
    const blob = {
      color: (isOnline) ? 'bg-success' : 'bg-gray-500',
      size: (size === 'lg') ? 'h-6 w-6' : 'h-3.5 w-3.5',
    };

    return (
      <span className="rounded-full absolute flex -right-0.5 -bottom-0.5">
        <span
          style={{ border: '2px solid var(--bg-secondary)' }}
          className={classNames(
            `relative inline-flex rounded-full px-1`,
            blob.size, blob.color)} />
      </span>
    );
  }

  const sizeClass = {
    'text-lg': size === 'lg',
    'text-sm': size !== 'lg',
  };

  return (
    <div className={classNames(
      `flex items-center px-2`,
      { 'opacity-50': !isOnline })}>
      <div className="relative avatar mr-2">
        <UserPresence />
        <Image
          className={(size === 'md')
            ? `select-none rounded-full w-8 h-8`
            : `select-none rounded-full w-20 h-20`}
          src={`${process.env.REACT_APP_CDN_URL}${user.avatarURL}`} />
      </div>
      <div className="tag leading-4">
        <h4 className={classNames(`font-bold`, sizeClass)}>
          <span
            style={{ color: highestRole?.color ?? 'var(--secondary)' }}
            className={classNames({ 'font-light text-base': guild })}>{user.username}</span>
          <span className="text-yellow-400 ml-1">
            {userOwnsGuild && <FontAwesomeIcon icon={faCrown} />}
          </span>
        </h4>
        {!guild && <div className={classNames(`discriminator`, sizeClass)}>#{discrim}</div>}
      </div>
    </div>
  );
}
 
export default Username;
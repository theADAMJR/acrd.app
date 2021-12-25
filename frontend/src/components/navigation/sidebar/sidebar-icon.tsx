import './sidebar-icon.scoped.css';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import Image from '../../utils/image';

export interface SidebarIconProps {
  imageURL?: string;
  name: string;
  to?: string;
  childClasses?: string;
  disableHoverEffect?: boolean;
}

const SidebarIcon: React.FunctionComponent<SidebarIconProps> = (props) => {
  let { to, imageURL, name, childClasses = 'bg-bg-primary font', disableHoverEffect } = props;
  const location = useLocation();
  if (imageURL)
    imageURL = `${process.env.REACT_APP_CDN_URL}${imageURL}`;

  const getAbbr = (name: string) => name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 3);

  const Icon = () => (imageURL)
    ? <Image
        className="h-12 w-12"
        src={imageURL}
        alt={name} />
    : <span className="select-none flex items-center justify-center h-12 w-12">{getAbbr(name)}</span>;

  const isActive = to && location.pathname.startsWith(to);
  const activeClasses = (isActive)
    ? 'rounded-xl bg-primary'
    : 'rounded-full';

  return (
    <div
      className={classNames('wrapper sidebar-icon', { 'active': isActive })}
      title={name}>
      <div className={classNames({
        'selected rounded absolute bg-white -left-1 h-0 w-2': !disableHoverEffect,
        'hidden': disableHoverEffect,
      })} />
      <div className={classNames(
        `cursor-pointer guild-icon flex justify-center mb-2`,
        activeClasses,
        childClasses,
      )}><Icon /></div>
    </div>
  );
}

export default SidebarIcon;
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import environment from '../../../environment';
import { getAbbr } from '../../../store/guilds';

import './sidebar-icon.scoped.css';

export interface SidebarIconProps {
  imageURL?: string;
  name: string;
  guildId?: string;
}

const SidebarIcon: React.FunctionComponent<SidebarIconProps> = ({ guildId, imageURL, name }) => {  
  const activeGuild = useSelector((s: Store.AppStore) => s.ui.activeGuild);
  const location = useLocation();

  if (imageURL)
    imageURL = `${environment.rootAPIURL}${imageURL}`;
  
  const Icon = () => (imageURL)
    ? <img
        style={{borderRadius: 'inherit'}}
        className="h-12 w-12"
        src={imageURL}
        alt={name} />
    : <span className="select-none heading h-12 w-12 flex items-center justify-center">{getAbbr(name)}</span>;
  
  const isActive = activeGuild?.id === guildId
    || imageURL && !guildId && location.pathname.startsWith('/channels/@me');

  const activeClasses = (isActive)
    ? 'rounded-xl bg-primary'
    : 'rounded-full bg-bg-primary';
    
  return (
    <div className={`${isActive && 'active'}`}>
      <div className="selected rounded bg-white absolute -left-1 h-2 w-0" />
      <div className={`cursor-pointer guild-icon flex justify-center mb-2 ${activeClasses}`}>
        <Icon />
      </div>
    </div>
  );
}
 
export default SidebarIcon;
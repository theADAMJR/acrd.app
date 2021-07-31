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
  const isActive = activeGuild?.id === guildId
    || location.pathname === '/channels/@me' && !guildId;

  if (imageURL)
    imageURL = `${environment.rootAPIURL}${imageURL}`;
  
  const abbr = getAbbr(name);
  const icon = (imageURL)
    ? <img style={{borderRadius: 'inherit'}} className="h-12 w-12" src={imageURL} alt={name} />
    : <span className="heading h-12 w-12 flex items-center justify-center">{abbr}</span>;
  
  const activeClasses = (isActive)
    ? 'rounded-xl bg-primary'
    : 'rounded-full bg-bg-primary';
    
  return (
    <div className={`wrapper ${isActive && 'active'}`}>
      <div className="selected rounded bg-white absolute -left-1" />
      <div className={`cursor-pointer guild-icon flex justify-center mb-2 ${activeClasses}`}>{icon}</div>
    </div>
  );
}
 
export default SidebarIcon;
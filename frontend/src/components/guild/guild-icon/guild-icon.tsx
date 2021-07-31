import { useSelector } from 'react-redux';
import { getAbbr } from '../../../store/guilds';

import './guild-icon.scoped.css';

export interface GuildIconProps {
  guild: Entity.Guild;
}

const GuildIcon: React.FunctionComponent<GuildIconProps> = ({ guild }) => {  
  const activeGuild = useSelector((s: Store.AppStore) => s.ui.activeGuild);
  const isActive = activeGuild?.id === guild.id;
  
  const abbr = getAbbr(guild.name);
  const icon = (guild.iconURL)
    ? <img className="h-12 w-12" src={guild.iconURL} alt={guild.name} />
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
 
export default GuildIcon;
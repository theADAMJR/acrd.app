import { useSelector } from 'react-redux';
import { getAbbr } from '../../../store/guilds';

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

  const selectedIndicator = <div
    style={{height: '40px', width: '8px'}}
    className="rounded bg-white absolute -left-1 my-2" />
    
  return (
    <>
      {selectedIndicator}
      <div className={`cursor-pointer guild-icon flex justify-center mb-2 ${activeClasses}`}>{icon}</div>
    </>
  );
}
 
export default GuildIcon;
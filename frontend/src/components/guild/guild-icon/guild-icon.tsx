import { getAbbr } from '../../../store/guilds';

export interface GuildIconProps {
  guild: Entity.Guild;
}

const GuildIcon: React.FunctionComponent<GuildIconProps> = ({ guild }) => {  
  const abbr = getAbbr(guild.name);
  const icon = (guild.iconURL)
    ? <img className="h-12 w-12" src={guild.iconURL} alt={guild.name} />
    : <span className="color-heading background-primary rounded-full h-12 w-12 flex items-center justify-center">{abbr}</span>;

  return <div className="cursor-pointer guild-icon flex justify-center mb-2">{icon}</div>;
}
 
export default GuildIcon;
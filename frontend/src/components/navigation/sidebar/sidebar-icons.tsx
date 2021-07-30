import { useSelector } from 'react-redux';
import GuildIcon from '../../guild/guild-icon/guild-icon';
import './sidebar-icons.scoped.css';
 
const SidebarIcons: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppStore) => s.auth.user)!;
  const guilds = useSelector((s: Store.AppStore) => s.entities.guilds)!;
  
  const iconify = (content: JSX.Element) => 
    <div className="guild-icon flex justify-center mb-1">{content}</div>;

  const guildIcons = guilds.map(g => <GuildIcon key={g.id} guild={g} />);
  const userAvatar = iconify(
    <img
      className="cursor-pointer h-12 w-12 rounded-full"
      src={user.avatarURL}
      alt={user.username} />
  );
  const plusIcon = <div className="flex items-center justify-center rounded-full h-12 w-12 bg-bg-primary success text-4xl font-light pb-1">+</div>;
  
  return (
    <div className="sidebar-icons flex flex-col bg-bg-tertiary px-2">
      {iconify(userAvatar)}
      {iconify(<div className="icon-separator mb-1" />)}
      {guildIcons}
      {plusIcon}
    </div>
  );
}
 
export default SidebarIcons;
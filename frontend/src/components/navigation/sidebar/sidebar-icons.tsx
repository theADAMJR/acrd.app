import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SidebarIcon from './sidebar-icon';
import { ContextMenuTrigger } from 'react-contextmenu';
import GuildMenu from '../../ctx-menus/guild-menu';
import PlusIcon from './plus-icon';
 
const SidebarIcons: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.auth.user)!;  
  const guilds = useSelector((s: Store.AppState) => s.entities.guilds)!;

  const guildIcons = guilds.map(g => (
    <ContextMenuTrigger key={g.id} id={g.id}>
      <Link to={`/channels/${g.id}`}>
        <SidebarIcon
          to={`/channels/${g.id}`}
          imageURL={g.iconURL}
          name={g.name} />
      </Link>
      <GuildMenu guild={g} />
    </ContextMenuTrigger>
  ));
  
  return (
    <div className="overflow-auto min-h-screen float-left p-3 flex flex-col bg-bg-tertiary">
      <Link to="/channels/@me">
        <SidebarIcon
          to="/channels/@me"
          imageURL={user.avatarURL}
          name={user.username} />
      </Link>
      <div className="flex justify-center mb-1">
        <div className="h-0.5 w-8 rounded-sm bg-bg-modifier-accent mb-1" />
      </div>
      {guildIcons}
      <PlusIcon id="createGuildButton" />
    </div>
  );
}
 
export default SidebarIcons;
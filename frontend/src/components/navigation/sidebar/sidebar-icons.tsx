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
      <div className="context-menu">
        <Link to={`/channels/${g.id}`}>
          <SidebarIcon
            to={`/channels/${g.id}`}
            imageURL={g.iconURL}
            name={g.name}
            tooltip={g.name} />
        </Link>
        <GuildMenu guild={g} />
      </div>
    </ContextMenuTrigger>
  ));

  return (
    <div className="sidebar-icons overflow-auto min-h-screen float-left p-3 flex flex-col bg-bg-tertiary">
      <Link to="/channels/@me">
        <SidebarIcon
          to="/channels/@me"
          imageURL={user.avatarURL}
          name={user.username}
          tooltip="Private Messages" />
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
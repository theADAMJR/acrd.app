import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { openedModal } from '../../../store/ui';
import CreateGuild from '../../modals/create-guild';
import SidebarIcon from './sidebar-icon';
import { ContextMenuTrigger } from 'react-contextmenu';
 
const SidebarIcons: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user)!;
  const guilds = useSelector((s: Store.AppStore) => s.entities.guilds)!;

  const guildIcons = guilds.map(g => (
    <ContextMenuTrigger key={g.id} id={g.id}>
      <Link to={`/channels/${g.id}`}>
        <SidebarIcon
          guildId={g.id}
          imageURL={g.iconURL}
          name={g.name} />
      </Link>
    </ContextMenuTrigger>
  ));

  const PlusIcon = () => <div
    onClick={() => dispatch(openedModal(CreateGuild))}
    className="cursor-pointer flex items-center justify-center rounded-full h-12 w-12 bg-bg-primary success text-4xl font-light pb-1">+</div>;
  
  return (
    <div className="h-screen float-left p-3 flex flex-col bg-bg-tertiary">
      <Link to="/channels/@me">
        <SidebarIcon
          imageURL={user.avatarURL}
          name={user.username} />
      </Link>
      <div className="guild-icon flex justify-center mb-1">
        <div className="h-0.5 w-8 rounded-sm bg-bg-modifier-accent mb-1" />
      </div>
      {guildIcons}
      <PlusIcon />
    </div>
  );
}
 
export default SidebarIcons;
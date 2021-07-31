import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { openedModal } from '../../../store/ui';
import CreateGuild from '../../modals/create-guild';
import SidebarIcon from './sidebar-icon';

import './sidebar-icons.scoped.css';
 
const SidebarIcons: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user)!;
  const guilds = useSelector((s: Store.AppStore) => s.entities.guilds)!;

  const guildIcons = guilds.map(g => (
    <Link key={g.id} to={`/channels/${g.id}`}>
      <SidebarIcon
        guildId={g.id}
        imageURL={g.iconURL}
        name={g.name} />
    </Link>
  ));

  const openCreateGuild = () => dispatch(openedModal({
    typeName: CreateGuild.name,
  }));
  const plusIcon = <div
    onClick={openCreateGuild}
    className="cursor-pointer flex items-center justify-center rounded-full h-12 w-12 bg-bg-primary success text-4xl font-light pb-1">+</div>;

  return (
    <div className="sidebar-icons flex flex-col bg-bg-tertiary px-2">
      <Link to="/channels/@me">
        <SidebarIcon
          imageURL={user.avatarURL}
          name={user.username} />
        </Link>
      <div className="guild-icon flex justify-center mb-1">
        <div className="icon-separator bg-bg-modifier-accent mb-1" />
      </div>
      {guildIcons}
      {plusIcon}
      <CreateGuild />
    </div>
  );
}
 
export default SidebarIcons;
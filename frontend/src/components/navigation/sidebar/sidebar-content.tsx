import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import SidebarFooter from './sidebar-footer';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Link } from 'react-router-dom';
import { ContextMenuTrigger } from 'react-contextmenu';
import { actions as ui } from '../../../store/ui';
import GuildDropdown from '../../dropdowns/guild-dropdown';
import ChannelMenu from '../../ctx-menus/channel-menu';
import { getGuildChannels } from '../../../store/guilds';
import usePerms from '../../../hooks/use-perms';

const SidebarContent: React.FunctionComponent = () => {  
  const dispatch = useDispatch();
  const { activeGuild, activeChannel } = useSelector((s: Store.AppState) => s.ui);
  const guildChannels = useSelector(getGuildChannels(activeGuild?.id));
  const perms = usePerms();
  
  const channels = guildChannels.map(c => (
    <ContextMenuTrigger key={c.id} id={c.id}>
      <Link
        to={`/channels/${activeGuild!.id}/${c.id}`}
        className={`
          cursor-pointer flex items-center rounded h-8 p-2 pl-3
          ${c.id === activeChannel?.id && 'active'}`}>
        <FontAwesomeIcon
          className="float-left mr-2 scale-150 muted fill-current"
          icon={faHashtag} />
        <span>{c.name}</span>
      </Link>
      <ChannelMenu channel={c} />
    </ContextMenuTrigger>
  ));

  return (
    <div className="flex flex-col bg-bg-secondary w-60">
      <div
        className="items-center shadow-elevation cursor-pointer h-12 pl-2.5 pr-4"
        onClick={() => dispatch(ui.toggleDropdown(GuildDropdown))}>
        <GuildDropdown />
      </div>
      <nav className="flex-grow px-2 pt-4">
        {activeGuild && perms.can('VIEW_CHANNELS', activeGuild.id) && channels}
      </nav>
      <SidebarFooter />
    </div>
  );
}
 
export default SidebarContent;
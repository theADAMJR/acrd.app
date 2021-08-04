import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faHashtag, faPlusCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import SidebarFooter from './sidebar-footer';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropdown from '../../utils/dropdown';
import { openedModal } from '../../../store/ui';
import CreateInvite from '../../modals/create-invite';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import './sidebar-content.scoped.css';
import CreateChannel from '../../modals/create-channel';
import { deleteChannel } from '../../../store/guilds';
import GuildSettings from '../../modals/guild-settings';
import UserSettings from '../../modals/user-settings';
import GuildDropdown from '../../dropdowns/guild-dropdown';

const SidebarContent: React.FunctionComponent = () => {  
  const dispatch = useDispatch();
  const ui = useSelector((s: Store.AppStore) => s.ui);
  
  const channels = ui.activeGuild?.channels.map(c => (
    <ContextMenuTrigger key={c.id} id={c.id}>
      <Link
        style={{height: '34px'}}
        to={`/channels/${ui.activeGuild!.id}/${c.id}`}
        className={`
          cursor-pointer flex items-center rounded p-2 pl-3
          ${c.id === ui.activeChannel?.id && 'active'}`}>
        <FontAwesomeIcon
          className="float-left mr-2 scale-150 muted fill-current"
          icon={faHashtag} />
        <span>{c.name}</span>
      </Link>

      <ContextMenu
        id={c.id}
        style={{width: '188px'}}
        className="bg-bg-tertiary p-2 rounded shadow">
        <MenuItem
          className="danger cursor-pointer"
          onClick={() => dispatch(deleteChannel(c.guildId!, c.id))}>
          <span>Delete channel</span>
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ));


  return (
    <div className="flex flex-col sidebar-content bg-bg-secondary">
      <div className="sidebar-header pl-2.5 pr-4">
        <GuildDropdown />
      </div>
      <div className="sidebar-details flex-grow px-2">
        <div className="h-4" />
        {channels}
      </div>
      <SidebarFooter />
    </div>
  );
}
 
export default SidebarContent;
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { leaveGuild } from '../../store/guilds';

export interface GuildMenuProps {
  guild: Entity.Guild;
}

const GuildMenu: React.FunctionComponent<GuildMenuProps> = ({ guild }) => {
  const dispatch = useDispatch();

  return (
    <ContextMenu
      key={guild.id}
      id={guild.id}
      className="bg-bg-tertiary rounded shadow w-48 p-2">
      <MenuItem
        className="flex items-center justify-between danger cursor-pointer"
        onClick={() => dispatch(leaveGuild(guild.id))}>
        <span>Leave Server</span>
        <FontAwesomeIcon icon={faDoorOpen} />
      </MenuItem>
    </ContextMenu>
  );
}
 
export default GuildMenu;
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { leaveGuild } from '../store/guilds';

const ContextMenus: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guilds = useSelector((s: Store.AppStore) => s.entities.guilds);

  const guildMenus = guilds.map(g => (
    <ContextMenu
      key={g.id}
      id={g.id}
      className="bg-bg-tertiary rounded shadow w-48 p-2">
      <MenuItem
        className="flex items-center justify-between danger cursor-pointer"
        onClick={() => dispatch(leaveGuild(g.id))}>
        <span>Leave Server</span>
        <FontAwesomeIcon icon={faDoorOpen} />
      </MenuItem>
    </ContextMenu>
  ));

  return (
    <>{guildMenus}</>
  );
}
 
export default ContextMenus;
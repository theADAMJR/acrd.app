import { Entity } from '@accord/types';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { leaveGuild } from '../../store/members';
import DevModeMenuSection from './dev-mode-menu-section';

export interface GuildMenuProps {
  guild: Entity.Guild;
}

const GuildMenu: React.FunctionComponent<GuildMenuProps> = ({ guild }) => {
  const dispatch = useDispatch();
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);

  return (
    <ContextMenu
      key={guild.id}
      id={guild.id}
      className="bg-bg-tertiary rounded shadow w-48 p-2">
      <MenuItem
        className="flex items-center justify-between danger cursor-pointer"
        onClick={() => dispatch(leaveGuild(guild.id))}>
        <span>Leave Guild</span>
        <FontAwesomeIcon icon={faDoorOpen} />
      </MenuItem>
      {devMode && <DevModeMenuSection ids={[
        { title: 'Guild ID', id: guild.id },
      ]} />}
    </ContextMenu>
  );
}
 
export default GuildMenu;
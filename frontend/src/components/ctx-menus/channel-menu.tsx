import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import usePerms from '../../hooks/use-perms';
import { deleteChannel } from '../../store/channels';
import DevModeMenuSection from './dev-mode-menu-section';

export interface ChannelMenusProps {
  channel: Entity.Channel;
}
 
const ChannelMenu: React.FunctionComponent<ChannelMenusProps> = ({ channel }) => {
  const dispatch = useDispatch();
  const { guildId }: any = useParams();
  const perms = usePerms();
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);

  return (guildId) ? (
    <ContextMenu
      key={channel.id}
      id={channel.id}
      className="bg-bg-tertiary rounded shadow w-52 p-2">
      {perms.can('MANAGE_CHANNELS', guildId) && (
        <MenuItem
          className="danger cursor-pointer"
          onClick={() => dispatch(deleteChannel(guildId!, channel.id))}>
          <span>Delete channel</span>
        </MenuItem>
      )}
      {devMode && <DevModeMenuSection ids={[
        { title: 'Channel ID', id: channel.id },
      ]} />}
    </ContextMenu>
  ) : null;
}
 
export default ChannelMenu;
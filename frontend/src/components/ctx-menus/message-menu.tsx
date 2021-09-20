import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import usePerms from '../../hooks/use-perms';
import { deleteChannel } from '../../store/channels';

export interface MessageMenuProps {
  channel: Entity.Channel;
}
 
const MessageMenu: React.FunctionComponent<MessageMenuProps> = ({ channel }) => {
  const dispatch = useDispatch();
  const { guildId }: any = useParams();
  const perms = usePerms();

  return (guildId) ? (
    <ContextMenu
      key={channel.id}
      id={channel.id}
      className="bg-bg-tertiary rounded shadow w-48 p-2">
      {perms.can('MANAGE_CHANNELS', guildId) && (
        <MenuItem
          className="danger cursor-pointer"
          onClick={() => dispatch(deleteChannel(guildId!, channel.id))}>
          <span>Delete channel</span>
        </MenuItem>
      )}
    </ContextMenu>
  ) : null;
}
 
export default MessageMenu;
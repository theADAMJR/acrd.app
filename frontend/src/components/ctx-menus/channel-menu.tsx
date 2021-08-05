import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteChannel } from '../../store/guilds';

export interface ChannelMenusProps {
  channel: Entity.Channel;
}
 
const ChannelMenu: React.FunctionComponent<ChannelMenusProps> = ({ channel }) => {
  const dispatch = useDispatch();
  const { guildId }: any = useParams();
  
  return (
    <ContextMenu
      key={channel.id}
      id={channel.id}
      className="bg-bg-tertiary rounded shadow w-48 p-2">
      <MenuItem
        className="danger cursor-pointer"
        onClick={() => dispatch(deleteChannel(guildId!, channel.id))}>
        <span>Delete channel</span>
      </MenuItem>
    </ContextMenu>
  );
}
 
export default ChannelMenu;
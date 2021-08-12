import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { kickMember } from '../../store/guilds';

export interface GuildMemberMenuProps {
  guild: Entity.Guild;
  user: Entity.User;
}

const GuildMemberMenu: React.FunctionComponent<GuildMemberMenuProps> = ({ guild, user }) => {
  const dispatch = useDispatch();
  const selfUser = useSelector((s: Store.AppStore) => s.auth.user)!;  

  const canManage = selfUser.id === guild.ownerId;
  const isSelf = user.id === selfUser.id;

  return (
    <ContextMenu
      id={user.id}
      className="bg-bg-tertiary p-2 rounded shadow">
      {canManage && !isSelf && <MenuItem
        className="danger cursor-pointer"
        onClick={() => dispatch(kickMember(guild.id, user.id))}>
        <span>Kick {user.username}</span>
      </MenuItem>}
    </ContextMenu>
  );
}
 
export default GuildMemberMenu;
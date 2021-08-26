import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../hooks/use-perms';
import { kickMember } from '../../store/members';

export interface GuildMemberMenuProps {
  guild: Entity.Guild;
  user: Entity.User;
}

const GuildMemberMenu: React.FunctionComponent<GuildMemberMenuProps> = ({ guild, user }) => {
  const dispatch = useDispatch();
  const selfUser = useSelector((s: Store.AppState) => s.auth.user)!;
  const perms = usePerms();

  const canManage = selfUser.id === guild.ownerId;
  const isSelf = user.id === selfUser.id;

  return (
    <ContextMenu
      id={user.id}
      className="bg-bg-tertiary p-2 rounded shadow">
      {(canManage && !isSelf && perms.can('KICK_MEMBERS', guild.id)) && (
        <MenuItem
          className="danger cursor-pointer"
          onClick={() => dispatch(kickMember(guild.id, user.id))}>
          <span>Kick {user.username}</span>
        </MenuItem>
      )}
    </ContextMenu>
  );
}
 
export default GuildMemberMenu;
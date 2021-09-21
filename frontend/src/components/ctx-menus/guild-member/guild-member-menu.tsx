import { faBan, faIdCard, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { getMember, kickMember } from '../../../store/members';
import { actions as ui } from '../../../store/ui';
import { toggleBlockUser } from '../../../store/users';
import UserProfile from '../../modals/user-profile';
import DevModeMenuSection from '../dev-mode-menu-section';
import RoleManager from './role-manager';

export interface GuildMemberMenuProps {
  user: Entity.User;
}

const GuildMemberMenu: React.FunctionComponent<GuildMemberMenuProps> = ({ user }) => {
  const dispatch = useDispatch();
  const perms = usePerms();
  const selfUser = useSelector((s: Store.AppState) => s.auth.user)!;
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const member = useSelector(getMember(guild.id, user.id))!;
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);

  const isSelf = user.id === selfUser.id;  
  const userIsBlocked = selfUser.ignored?.userIds.includes(member.userId);

  return (
    <ContextMenu
      id={user.id}
      className="bg-bg-tertiary p-2 rounded shadow">
      <MenuItem
        onClick={() => {
          dispatch(ui.focusedUser(user));
          dispatch(ui.openedModal('UserProfile'));
        }}
        className="flex items-center justify-between cursor-pointer">
        <span>View Profile</span>
        <FontAwesomeIcon icon={faUser} />
      </MenuItem>
      
      {user.id !== selfUser.id && (<>
        <hr className="my-2 border-bg-primary" />
        <MenuItem className="flex items-center justify-between  cursor-pointer danger">
          <span
            onClick={() => dispatch(toggleBlockUser(member.userId))}>
            {userIsBlocked ? 'Unblock' : 'Block'}
          </span>
          <FontAwesomeIcon icon={faBan} />
        </MenuItem>
      </>)}
        
      <hr className="my-2 border-bg-primary" />

      {(!isSelf && perms.can('KICK_MEMBERS', guild.id)) && (
        <MenuItem
          className="danger cursor-pointer mb-2"
          onClick={() => dispatch(kickMember(guild.id, user.id))}>
          <span>Kick {user.username}</span>
        </MenuItem>
      )}
      {perms.can('MANAGE_ROLES', guild.id) && <RoleManager member={member} />}

      <div className="mb-10" />
      {devMode && <DevModeMenuSection ids={[
        { title: 'User ID', id: user.id },
        { title: 'Member ID', id: member.id },
      ]} />}
    </ContextMenu>
  );
}
 
export default GuildMemberMenu;
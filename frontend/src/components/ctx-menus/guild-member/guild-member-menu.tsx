import { Entity } from '@accord/types';
import { faBan, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { getMember, kickMember } from '../../../store/members';
import { actions as ui, openUserProfile } from '../../../store/ui';
import { toggleBlockUser } from '../../../store/users';
import Category from '../../utils/category';
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

  const canKick = perms.can('KICK_MEMBERS', guild.id);
  const canManage = perms.can('MANAGE_ROLES', guild.id);

  const onKickMember = () => {
    const discrim = user.discriminator.toString().padStart(4, '0');
    const isConfirmed = window.confirm(`Kick ${user.username}#${discrim}`);
    if (isConfirmed)
      dispatch(kickMember(guild.id, user.id));
  }

  return (
    <ContextMenu
      id={user.id}
      className="bg-bg-tertiary p-2 rounded shadow">
      <MenuItem
        onClick={() => dispatch(openUserProfile(user))}
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

      {(canKick || canManage) && (
        <div>
          <hr className="my-2 border-bg-primary" />
          <Category title="Manage Roles" className="pb-2" />

          {(!isSelf && perms.can('KICK_MEMBERS', guild.id)) && (
            <MenuItem
              className="danger cursor-pointer mb-2"
              onClick={onKickMember}>
              <span>Kick {user.username}</span>
            </MenuItem>
          )}
          {perms.can('MANAGE_ROLES', guild.id) && <RoleManager member={member} />}
        </div>
      )}

      <div className="my-4" />
      {devMode && <DevModeMenuSection ids={[
        { title: 'User ID', id: user.id },
        { title: 'Member ID', id: member.id },
      ]} />}
    </ContextMenu>
  );
}
 
export default GuildMemberMenu;
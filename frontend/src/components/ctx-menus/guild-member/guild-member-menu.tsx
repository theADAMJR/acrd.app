import { useState } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { getMember, kickMember } from '../../../store/members';
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

  const isSelf = user.id === selfUser.id;  

  return (
    <ContextMenu
      id={user.id}
      className="bg-bg-tertiary p-2 rounded shadow">
      {(!isSelf && perms.can('KICK_MEMBERS', guild.id)) && (
        <MenuItem
          className="danger cursor-pointer"
          onClick={() => dispatch(kickMember(guild.id, user.id))}>
          <span>Kick {user.username}</span>
        </MenuItem>
      )}
      {perms.can('MANAGE_ROLES', guild.id) && <RoleManager member={member} />}
    </ContextMenu>
  );
}
 
export default GuildMemberMenu;
import Category from '../utils/category';
import Username from './username';
import { useSelector } from 'react-redux';
import { ContextMenuTrigger } from 'react-contextmenu';
import GuildMemberMenu from '../ctx-menus/guild-member/guild-member-menu';
import { getGuildMembers, getGuildUsers } from '../../store/guilds';
import { filterHoistedRoles } from '../../store/roles';
import usePerms from '../../hooks/use-perms';
import { Entity } from '@accord/types';

const MemberList: React.FunctionComponent = () => {
  const perms = usePerms();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const isActive = useSelector((s: Store.AppState) => s.config.memberListToggled);
  const hoistedRoles = useSelector(filterHoistedRoles(guild.id));
  const members = useSelector(getGuildMembers(guild.id));

  const users = useSelector(getGuildUsers(guild.id))
    .filter(u => {
      const member = members.find(m => m.userId === u.id)!;
      return perms.canMember('VIEW_CHANNELS', guild, member);
    });
   
  type UserListFilter = (s: Entity.User, i: number, a: Entity.User[]) => boolean;
  const UserList = ({ category, filter: by }: { category: string, filter: UserListFilter }) => {
    const filtered = users
      .filter(by)
      .sort((a, b) => a.username.localeCompare(b.username));

    return (filtered.length) ? (
      <div>
        <Category
          className="pt-6 pr-2 pl-4 h-10 mb-2 ml-2"
          title={category}
          count={filtered.length} />
        {filtered.map(u => (
          <ContextMenuTrigger
            id={u.id}
            key={u.id}>
            <div className="m-2">
              <Username guild={guild} user={u} />
            </div>
            <GuildMemberMenu user={u} />
          </ContextMenuTrigger>
        ))}
      </div>
    ) : null;
  }

  const getRoleIds = (userId: string) => members.find(m => m.userId === userId)!.roleIds;
  const byPositionDesc = (a, b) => (a.position < b.position) ? 1 : -1
  const hoistedRoleIds = (user: Entity.User) => getRoleIds(user.id)
    .map(id => hoistedRoles.find(r => id === r.id))
    .filter(r => r) // role could be deleted, on member
    .sort(byPositionDesc)
    .map(r => r!.id);

  return (isActive) ? (
    <div className="overflow-auto bg-bg-secondary w-64">
      {hoistedRoles.map(r =>
        <UserList
          key={r.id}
          category={r.name}
          filter={u => (
            getRoleIds(u.id).includes(r.id)
              && hoistedRoleIds(u)[0] === r.id
              && u.status === 'ONLINE')} />
      )}
      <UserList
        category="Online"
        filter={u => u.status === 'ONLINE' && !hoistedRoleIds(u).length} />
      <UserList
        category="Offline"
        filter={u => u.status === 'OFFLINE'} />
    </div>
  ) : null;
}
 
export default MemberList;
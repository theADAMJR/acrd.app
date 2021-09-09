import Category from '../utils/category';
import Username from './username';
import { useSelector } from 'react-redux';
import { ContextMenuTrigger } from 'react-contextmenu';
import GuildMemberMenu from '../ctx-menus/guild-member/guild-member-menu';
import { getGuildMembers, getGuildUsers } from '../../store/guilds';
import { filterHoistedRoles } from '../../store/roles';
import usePerms from '../../hooks/use-perms';
import { getMember } from '../../store/members';

const MemberList: React.FunctionComponent = () => {
  const perms = usePerms();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const isActive = useSelector((s: Store.AppState) => s.config.memberListToggled);
  const hoistedRoles = useSelector(filterHoistedRoles(guild.id));
  const members = useSelector(getGuildMembers(guild.id));

  // get users that can view the channel
  const users = useSelector(getGuildUsers(guild.id))
    .filter(u => {
      const member = members.find(m => m.userId === u.id)!;
      return perms.canMember('VIEW_CHANNELS', guild, member);
    });
   
  type UserListFilter = (s: Entity.User, i: number, a: Entity.User[]) => boolean;
  const UserList = ({ category, filter: by }: { category: string, filter: UserListFilter }) => {
    const filtered = users.filter(by);
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
  const hoisted = (user: Entity.User) => getRoleIds(user.id)
    .some(id => hoistedRoles
      .some(r => id === r.id));

  return (isActive) ? (
    <div className="bg-bg-secondary w-64">
      {hoistedRoles.map(r =>
        <UserList
          key={r.id}
          category={r.name}
          filter={u =>
            getRoleIds(u.id).includes(r.id)
            && hoisted(u)
            && u.status === 'ONLINE'} />)}
      <UserList
        category="Online"
        filter={u => u.status === 'ONLINE' && !hoisted(u)} />
      <UserList
        category="Offline"
        filter={u => u.status === 'OFFLINE'} />
    </div>
  ) : null;
}
 
export default MemberList;
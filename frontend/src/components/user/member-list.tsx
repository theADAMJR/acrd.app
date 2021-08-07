import Category from '../utils/category';
import Username from './username';
import { useSelector } from 'react-redux';
import { ContextMenuTrigger } from 'react-contextmenu';
import GuildMemberMenu from '../ctx-menus/guild-member-menu';

export interface MemberListProps {
  users: Entity.User[];
}

const MemberList: React.FunctionComponent<MemberListProps> = (props: MemberListProps) => {
  const guild = useSelector((s: Store.AppStore) => s.ui.activeGuild)!;
  const isActive = useSelector((s: Store.AppStore) => s.config.memberListToggled);

  const members = props.users.map(u => (
    <ContextMenuTrigger id={u.id} key={u.id}>
      <div className="mb-2">
        <Username guild={guild} user={u} />
      </div>
      <GuildMemberMenu guild={guild} user={u} />
    </ContextMenuTrigger>
  ));

  return (isActive) ? (
    <div className="bg-bg-secondary w-64">
      <Category
        className="pt-6 pr-2 pl-4 h-10"
        title="Members"
        count={props.users.length} />
      <div className="mt-2 ml-2">{members}</div>
    </div>
  ) : null;
}
 
export default MemberList;
import * as React from 'react';
import Category from '../category/category';
import './member-list.scoped.css';
import Username from '../username/username';

export interface MemberListProps {
  users: Entity.User[];
  guild?: Entity.Guild;
}

const MemberList: React.FunctionComponent<MemberListProps> = (props: MemberListProps) => {
  const members = props.users.map(u => <Username
    key={u.id}
    user={u}
    guild={props.guild} />
  );

  return (
    <div className="member-list background-secondary">
      <Category title="Online" count={props.users.length} />
      <div>{members}</div>
    </div>
  );
}
 
export default MemberList;
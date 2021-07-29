import * as React from 'react';
import Category from '../category/category';
import './member-list.scoped.css';
import Username from '../username/username';
import { useStore } from 'react-redux';

export interface MemberListProps {
  users: Entity.User[];
}

const MemberList: React.FunctionComponent<MemberListProps> = (props: MemberListProps) => {
  const { activeGuild } = useStore().getState().ui;
  
  const members = props.users.map(u => <Username
    key={u.id}
    user={u}
    guild={guild} />
  );

  return (
    <div className="member-list background-secondary">
      <Category title="Online" count={props.users.length} />
      <div>{members}</div>
    </div>
  );
}
 
export default MemberList;
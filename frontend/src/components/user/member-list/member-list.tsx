import * as React from 'react';
import Category from '../../category/category';
import './member-list.scoped.css';
import Username from '../username/username';
import { useStore } from 'react-redux';

export interface MemberListProps {
  users: Entity.User[];
}

const MemberList: React.FunctionComponent<MemberListProps> = (props: MemberListProps) => {
  const { activeGuild } = useStore().getState().ui;
  
  const members = props.users.map(u => (
    <div className="mb-1">
      <Username
      key={u.id}
      user={u}
      guild={activeGuild} />
    </div>
  ));

  return (
    <div className="member-list bg-bg-secondary">
      <Category title="Online" count={props.users.length} />
      <div className="mt-2 ml-2">{members}</div>
    </div>
  );
}
 
export default MemberList;
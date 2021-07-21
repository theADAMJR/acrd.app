import * as React from 'react';
import { temp } from '../utils/src/temp';
import Category from './category';
import './member-list.css';
import Username from './username';

export interface MemberListProps {
  users: Entity.User[];
  guild?: Entity.Guild;
}
export interface MemberListState {}
 
class MemberList extends React.Component<MemberListProps, MemberListState> {
  get members() {
    return this.props.users
      .map(u => <Username key={u.id} user={u} guild={this.props.guild} />);
  }
  
  render() { 
    return (
      <div className="member-list background-secondary">
        <Category title="Online" count={temp.users.length} />
        {this.members}
      </div>
    );
  }
}
 
export default MemberList;
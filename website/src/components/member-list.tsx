import * as React from 'react';
import './member-list.css';

export interface MemberListProps {
  
}
 
export interface MemberListState {
  
}
 
class MemberList extends React.Component<MemberListProps, MemberListState> {
  state = {}
  render() { 
    return (
      <div className="member-list background-secondary">Member List</div>
    );
  }
}
 
export default MemberList;
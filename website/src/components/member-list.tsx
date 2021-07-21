
import * as React from 'react';

export interface MemberListProps {
  
}
 
export interface MemberListState {
  
}
 
class MemberList extends React.Component<MemberListProps, MemberListState> {
  state = {}
  render() { 
    return (
      <div className="member-list">Member List</div>
    );
  }
}
 
export default MemberList;
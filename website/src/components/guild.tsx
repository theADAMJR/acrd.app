import { Component } from 'react';
import MemberList from './member-list';
import TextBasedChannel from './text-based-channel';

export interface GuildProps {
  guild: Entity.Guild;
}
 
export interface GuildState {
  guild: Entity.Guild;
}
 
class Guild extends Component<GuildProps, GuildState> {
  state = { guild: undefined as any };

  render() { 
    return (
      <div className="guild">
        <TextBasedChannel></TextBasedChannel>
        <MemberList></MemberList>
      </div>
    );
  }
}
 
export default Guild;
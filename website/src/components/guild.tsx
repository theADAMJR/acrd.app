import { Component } from 'react';
import MemberList from './member-list';
import TextBasedChannel from './text-based-channel';
import './guild.scoped.css';
import store from '../redux/store';

export interface GuildProps {
  guild: Entity.Guild;
}
 
const Guild: React.FunctionComponent<GuildProps> = (props: GuildProps) => {
  const state = store.getState();
  
  return (
    <div className="guild">
      <TextBasedChannel channel={state.activeChannel} />
      <MemberList users={props.guild.members} guild={props.guild} />
    </div>
  );
}
 
export default Guild;
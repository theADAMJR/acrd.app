import { Component } from 'react';
import { temp } from '../utils/src/temp';
import MemberList from './member-list';
import TextBasedChannel from './text-based-channel';
import './guild.css';

export interface GuildProps {
  guild: Entity.Guild;
}
 
export interface GuildState {
  guild: Entity.Guild;
}
 
class Guild extends Component<GuildProps, GuildState> {
  state = {
    guild: temp.guilds[0],
  };

  render() { 
    return (
      <div className="guild">
        <TextBasedChannel />
        <MemberList />
      </div>
    );
  }
}
 
export default Guild;
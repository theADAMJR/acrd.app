import MemberList from '../member-list/member-list';
import TextBasedChannel from '../text-based-channel/text-based-channel';
import store from '../../redux/store';
import './guild.scoped.css';

export interface GuildProps {
  guild: Entity.Guild;
}
 
const Guild: React.FunctionComponent<GuildProps> = (props: GuildProps) => {
  const state = store.getState();
  const channel = state.activeChannel;
  
  return (
    <div className="guild">
      {channel && <TextBasedChannel channel={channel} />}
      {!channel && 'TODO: no channel'}
      <MemberList users={props.guild.members} guild={props.guild} />
    </div>
  );
}
 
export default Guild;
import MemberList from '../member-list/member-list';
import TextBasedChannel from '../text-based-channel/text-based-channel';
import './guild.scoped.css';
import store from '../../redux/store';

export interface GuildProps {
  guild: Entity.Guild;
}
 
const Guild: React.FunctionComponent<GuildProps> = (props: GuildProps) => {
  const state = store.getState();
  const channel = state.activeChannel;
  
  return (
    <div className="guild">
      {channel && <TextBasedChannel channel={channel} />}
      <MemberList users={props.guild.members} guild={props.guild} />
    </div>
  );
}
 
export default Guild;
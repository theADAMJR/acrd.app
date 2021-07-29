import MemberList from '../user/member-list/member-list';
import TextBasedChannel from '../text-based-channel/text-based-channel';
import { useStore } from 'react-redux';
import './guild.scoped.css';
 
const Guild: React.FunctionComponent = () => {
  const state: Store.AppStore = useStore().getState();
  const { activeChannel } = state.ui;
  const guild = state.ui.activeGuild as Entity.Guild;

  return (
    <div className="guild">
      {activeChannel && <TextBasedChannel />}
      {!activeChannel && 'TODO: no channel'}
      <MemberList users={guild.members} />
    </div>
  );
}
 
export default Guild;
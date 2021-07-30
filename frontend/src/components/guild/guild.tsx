import MemberList from '../user/member-list/member-list';
import TextBasedChannel from '../channel/text-based-channel';
import { useDispatch, useSelector, useStore } from 'react-redux';
import './guild.scoped.css';
import { channelSwitched } from '../../store/ui';
 
const Guild: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const ui = useSelector((s: Store.AppStore) => s.ui);
  const guild = ui.activeGuild as Entity.Guild;

  if (guild.channels.length && !ui.activeChannel) {
    const systemChannel = guild.channels[0];
    dispatch(channelSwitched(systemChannel));
  }

  return (
    <div className="guild">
      {ui.activeChannel && <TextBasedChannel />}
      {!ui.activeChannel && 'TODO: no channel'}
      <MemberList users={guild.members} />
    </div>
  );
}
 
export default Guild;
import { useDispatch, useSelector, useStore } from 'react-redux';
import AppNavbar from '../navigation/app-navbar';
import Sidebar from '../navigation/sidebar/sidebar';
import { Redirect, useParams } from 'react-router-dom';
import { channelSwitched, guildSwitched } from '../../store/ui';
import TextBasedChannel from '../channel/text-based-channel';
import MemberList from '../user/member-list/member-list';
import './guild-page.scoped.css';
import { getGuild } from '../../store/guilds';

const GuildPage: React.FunctionComponent = (props: any) => {  
  const params: any = useParams();
  const dispatch = useDispatch();
  const ui = useSelector((s: Store.AppStore) => s.ui);
  
  const state = useStore().getState();
  const guild = getGuild(params.guildId)(state);
  if (!guild)
    return <Redirect to="/channels/@me" />

  dispatch(guildSwitched(guild));

  if (guild.channels.length && !ui.activeChannel) {
    const systemChannel = guild.channels[0];
    dispatch(channelSwitched(systemChannel));
  }
  
  return (
    <>
      <Sidebar />
      <div className="content bg-bg-primary">
        <AppNavbar />
        <div className="guild">
          {ui.activeChannel && <TextBasedChannel />}
          {!ui.activeChannel && 'TODO: no channel'}
          <MemberList users={guild.members} />
        </div>
      </div>
    </>
  );
}
 
export default GuildPage;
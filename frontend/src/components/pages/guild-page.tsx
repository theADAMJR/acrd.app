import { useDispatch, useSelector } from 'react-redux';
import AppNavbar from '../navigation/app-navbar';
import Sidebar from '../navigation/sidebar/sidebar';
import { Redirect, useParams } from 'react-router-dom';
import { channelSwitched, guildSwitched } from '../../store/ui';
import TextBasedChannel from '../channel/text-based-channel';
import MemberList from '../user/member-list/member-list';
import './guild-page.scoped.css';
import { getChannel, getGuild } from '../../store/guilds';
import { useEffect } from 'react';

const GuildPage: React.FunctionComponent = (props: any) => {  
  const params: any = useParams();
  const dispatch = useDispatch();
  
  const ui = useSelector((s: Store.AppStore) => s.ui);

  const guild = useSelector(getGuild(params.guildId));
  const channel = useSelector(getChannel(params.guildId, params.channelId));

  useEffect(() => {
    dispatch(guildSwitched(guild));
    dispatch(channelSwitched(channel));
  }, [window.location.href]);

  if (!guild)
    return <Redirect to="/channels/@me" />

  if (guild.channels.length && !ui.activeChannel) {
    const systemChannel = guild.channels[0];
    return <Redirect to={`/channels/${guild.id}/${systemChannel.id}`} />
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
import { useDispatch, useSelector } from 'react-redux';
import AppNavbar from '../navigation/app-navbar';
import Sidebar from '../navigation/sidebar/sidebar';
import { Redirect, useParams } from 'react-router-dom';
import { pageSwitched } from '../../store/ui';
import TextBasedChannel from '../channel/text-based-channel';
import MemberList from '../user/member-list/member-list';
import { getChannel, getGuild } from '../../store/guilds';
import { useEffect } from 'react';
import PageWrapper from './page-wrapper';

const GuildPage: React.FunctionComponent = () => {  
  const params: any = useParams();
  const dispatch = useDispatch();
  
  const ui = useSelector((s: Store.AppStore) => s.ui);

  const guild = useSelector(getGuild(params.guildId));
  const channel = useSelector(getChannel(params.guildId, params.channelId));

  useEffect(() => {
    dispatch(pageSwitched({ channel, guild }));
  }, [guild, channel]);

  if (!guild)
    return <Redirect to="/channels/@me" />

  if (guild.channels.length && !params.channelId) {
    const systemChannel = guild.channels[0];
    return <Redirect to={`/channels/${guild.id}/${systemChannel.id}`} />
  }
  
  return (
    <PageWrapper>
      <Sidebar />
      <div className="bg-bg-primary">
        <AppNavbar />
        <div style={{height: 'calc(100vh - 48px)'}} className="flex">
          {ui.activeChannel && <TextBasedChannel />}
          <MemberList users={guild.members} />
        </div>
      </div>
    </PageWrapper>
  );
}
 
export default GuildPage;
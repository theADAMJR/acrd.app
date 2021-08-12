import { useDispatch, useSelector } from 'react-redux';
import AppNavbar from '../navigation/app-navbar';
import Sidebar from '../navigation/sidebar/sidebar';
import { Redirect, useParams } from 'react-router-dom';
import { pageSwitched } from '../../store/ui';
import TextBasedChannel from '../channel/text-based-channel';
import MemberList from '../user/member-list';
import { getChannel, getGuild } from '../../store/guilds';
import { useEffect } from 'react';
import PageWrapper from './page-wrapper';

const GuildPage: React.FunctionComponent = () => {  
  const { channelId, guildId }: any = useParams();
  const dispatch = useDispatch();
  const ui = useSelector((s: Store.AppStore) => s.ui);
  const guild = useSelector(getGuild(guildId));
  const channel = useSelector(getChannel(guildId, channelId));

  useEffect(() => {
    dispatch(pageSwitched({ channel, guild }));
  }, [guild, channel]);

  if (!guild) 
    return <Redirect to="/channels/@me" />;
  else if (guild.channels.length && !channelId) {
    const systemChannel = guild.channels[0];
    return <Redirect to={`/channels/${guild.id}/${systemChannel.id}`} />;
  }
  
  return (ui.activeGuild) ? (
    <PageWrapper pageTitle={channel?.name ?? guild.name}>
      <Sidebar />
      {(channel)
        ? <div className="bg-bg-primary">
            <AppNavbar />
            <div
              style={{ height: 'calc(100vh - 48px)' }}
              className="flex">
              {ui.activeChannel && <TextBasedChannel />}
              <MemberList users={guild.members} />
            </div>
          </div>
        : <div className="bg-bg-tertiary" />}
    </PageWrapper>
  ) : null;
}
 
export default GuildPage;
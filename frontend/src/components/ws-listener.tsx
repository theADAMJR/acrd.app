import { useDispatch, useSelector } from 'react-redux';
import ws from '../store/services/ws';
import { actions as guilds } from '../store/guilds';
import { actions as messages } from '../store/messages';
import { actions as channels } from '../store/channels';
import { actions as auth } from '../store/auth';
import ui, { closedModal, focusedInvite } from '../store/ui';
import { useEffect } from 'react';
import { actions as meta } from '../store/meta';
import { actions as users } from '../store/users';
import { useHistory } from 'react-router-dom';

// should this go in guilds reducer file?
const WSListener: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const hasListenedToWS = useSelector((s: Store.AppStore) => s.meta.hasListenedToWS);
  const activeChannel = useSelector((s: Store.AppStore) => s.ui.activeChannel);
  const activeGuild = useSelector((s: Store.AppStore) => s.ui.activeGuild);
  const user = useSelector((s: Store.AppStore) => s.auth.user);

  useEffect(() => {
    if (hasListenedToWS) return;

    ws.on('error', (error: any) => alert(error?.message));

    // add channel to guilds.channels
    ws.on('CHANNEL_CREATE', (args) => {
      // if we made it, we want to navigate there\
    if (args.creatorId === user!.id)
      dispatch(closedModal());
    });
    ws.on('CHANNEL_DELETE', (args) => {
      // if in channel, go away from it
      const inChannel = args.channelId === activeChannel?.id;
      if (inChannel && activeGuild)
        history.push(`/channels/${activeGuild.id}`);

      dispatch(guilds.channelDeleted(args));
    });
    // listen to passive events (not received by api middleware)
    ws.on('GUILD_MEMBER_ADD', (args) => {
      dispatch(guilds.memberAdded(args));
      dispatch(users.fetched(args.member));
    });
    // user may be in mutual guilds, and therefore not removed from global user cache
    ws.on('GUILD_MEMBER_REMOVE', (args) => dispatch(guilds.memberRemoved(args)));
    ws.on('INVITE_CREATE', (args) => {
      dispatch(guilds.inviteCreated(args));
      dispatch(focusedInvite(args.invite));
    });
    ws.on('GUILD_CREATE', (args) => {
      dispatch(guilds.created(args));
      dispatch(users.fetched(args.guild.members));
      dispatch(closedModal());
      history.push(`/channels/${args.guild.id}`);
    });
    // ws.on('GUILD_UPDATE', (args) => dispatch(guilds.updated (args)));
    ws.on('TYPING_START', (args) => dispatch(channels.userTyped(args)));
    ws.on('GUILD_DELETE', (args) => dispatch(guilds.deleted(args)));
    ws.on('MESSAGE_CREATE', (args) => dispatch(messages.created(args)));
    ws.on('MESSAGE_DELETE', (args) => dispatch(messages.deleted(args)));
    ws.on('MESSAGE_UPDATE', (args) => dispatch(messages.updated(args)));
    ws.on('READY', (args) => dispatch(auth.ready(args)));

    dispatch(meta.listenedToWS());
  }, [hasListenedToWS]);
  
  return null;
}
 
export default WSListener;
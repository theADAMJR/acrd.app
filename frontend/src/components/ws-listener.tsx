import { useDispatch, useSelector, useStore } from 'react-redux';
import ws from '../store/services/ws';
import { actions as guilds } from '../store/guilds';
import { actions as messages } from '../store/messages';
import { actions as channels } from '../store/channels';
import { actions as auth, logoutUser } from '../store/auth';
import { closedModal, focusedInvite } from '../store/ui';
import { useEffect } from 'react';
import { actions as meta } from '../store/meta';
import { actions as users } from '../store/users';
import { useHistory } from 'react-router-dom';

const WSListener: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const store = useStore();
  const hasListenedToWS = useSelector((s: Store.AppStore) => s.meta.hasListenedToWS);

  const getState = () => store.getState() as Store.AppStore;

  useEffect(() => {
    if (hasListenedToWS) return;

    ws.on('error', (error: any) => {
      alert(error.data?.message ?? error.message);
    });

    // add channel to guilds.channels
    ws.on('CHANNEL_CREATE', (args) => {      
      // if we created it, we want to navigate there
      // we'd expect the user to exist, as they should be logged in to receive ws events
      const { auth, ui } = getState();      
      const selfCreated = args.creatorId === auth.user!.id;
      
      // we cannot go to the channel if not in store 
      dispatch(guilds.channelCreated(args));

      if (selfCreated && ui.activeGuild) {
        dispatch(closedModal());
        history.push(`/channels/${ui.activeGuild.id}/${args.channel.id}`);
      }
    });
    ws.on('CHANNEL_DELETE', (args) => {
      // if in channel, go away from it
      const { ui } = getState();
      const inChannel = args.channelId === ui.activeChannel?.id;

      if (inChannel && ui.activeGuild)
        history.push(`/channels/${ui.activeGuild.id}`);

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
    ws.on('GUILD_DELETE', (args) => {
      const { ui } = getState();
      const guildIsActive = args.guildId === ui.activeGuild?.id;
      if (guildIsActive) {
        dispatch(closedModal());
        history.push('/channels/@me');
      }
      guilds.deleted(args);
    });
    ws.on('GUILD_UPDATE', (args) => dispatch(guilds.updated(args)));
    ws.on('TYPING_START', (args) => {
      dispatch(channels.userTyped(args));

      const timeoutMs = 5000;
      setTimeout(() => {
        dispatch(channels.userStoppedTyping(args));
      }, timeoutMs);
    });
    ws.on('GUILD_DELETE', (args) => dispatch(guilds.deleted(args)));
    ws.on('MESSAGE_CREATE', (args) => dispatch(messages.created(args)));
    ws.on('MESSAGE_DELETE', (args) => dispatch(messages.deleted(args)));
    ws.on('MESSAGE_UPDATE', (args) => dispatch(messages.updated(args)));
    ws.on('READY', (args) => {
      dispatch(auth.ready(args));
      dispatch(users.fetched(args.user));
    });
    ws.on('USER_DELETE', () => {
      ws.disconnect();
      history.push('/');
      dispatch(logoutUser());
    });
    ws.on('USER_UPDATE', (args) => {
      dispatch(auth.updatedUser(args));
      dispatch(users.updated(args));
    });

    dispatch(meta.listenedToWS());
  }, [hasListenedToWS]);
  
  return null;
}
 
export default WSListener;
import { useDispatch, useSelector, useStore } from 'react-redux';
import ws from '../services/ws-service';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { actions as users, getUser } from '../store/users';
import { actions as meta } from '../store/meta';
import { actions as uiActions, Dialog, openUserProfile } from '../store/ui';
import { actions as invites } from '../store/invites';
import { actions as members, getSelfMember } from '../store/members';
import { actions as roles } from '../store/roles';
import { actions as typing } from '../store/typing';
import { actions as guilds } from '../store/guilds';
import { actions as messages } from '../store/messages';
import { actions as channels } from '../store/channels';
import { actions as auth, logoutUser } from '../store/auth';
import { actions as pings, addPing } from '../store/pings';
import { actions as themes } from '../store/themes';
import { useSnackbar } from 'notistack';
import events from '../services/event-service';
import { startVoiceFeedback, stopVoiceFeedback } from '../services/voice-service';
import fetchEntities from '../store/actions/fetch-entities';

const WSListener: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const store = useStore();
  const hasListened = useSelector((s: Store.AppState) => s.meta.hasListenedToWS);
  const { enqueueSnackbar } = useSnackbar();

  const state = () => store.getState() as Store.AppState;

  // TODO: make alphabetical order
  useEffect(() => {
    if (hasListened) return;    

    const handleDialog = (dialog: Dialog) =>    
      enqueueSnackbar(`${dialog.content}.`, {
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        variant: dialog.variant,
        autoHideDuration: 5000,
      });
    
    ws.on('error', (error: any) => handleDialog({
      variant: 'error',
      content: error.data?.message ?? error.message,
    }));
    events.on('dialog', handleDialog);
    events.on('openUserProfile', (userId: string) => {
      const user = getUser(userId)(store.getState());
      if (!user.discriminator) return;

      dispatch(openUserProfile(user));
    });

    // add channel to guilds.channels
    ws.on('CHANNEL_CREATE', (args) => {
      // if we created it, we want to navigate there
      // we'd expect the user to exist, as they should be logged in to receive ws events
      const { auth, ui } = state();      
      const selfCreated = args.creatorId === auth.user!.id;
      
      // we cannot go to the channel if not in store 
      dispatch(channels.created(args));

      if (selfCreated && ui.activeGuild) {
        dispatch(uiActions.closedModal());
        if (args.channel.type === 'VOICE') return;

        history.push(`/channels/${ui.activeGuild.id}/${args.channel.id}`);
      }
    });
    ws.on('CHANNEL_DELETE', (args) => {
      // if in channel, go away from it
      const { ui } = state();
      const inChannel = args.channelId === ui.activeChannel?.id;

      if (inChannel && ui.activeGuild)
        history.push(`/channels/${ui.activeGuild.id}`);

      dispatch(channels.deleted(args));
    });
    ws.on('CHANNEL_UPDATE', (args) => dispatch(channels.updated(args)));
    ws.on('GUILD_CREATE', (args) => {
      dispatch(users.fetched(args.users)); // this before members
      dispatch(channels.fetched(args.channels));
      dispatch(members.fetched(args.members));
      dispatch(roles.fetched(args.roles)); // this after members
      dispatch(guilds.created(args));
      dispatch(uiActions.closedModal());
      history.push(`/channels/${args.guild.id}`);
    });
    ws.on('GUILD_DELETE', (args) => {
      const { ui } = state();
      const guildIsActive = args.guildId === ui.activeGuild?.id;
      if (guildIsActive) {
        dispatch(uiActions.closedModal());
        history.push('/channels/@me');
      }
      dispatch(guilds.deleted(args));
      // clean up leaving guild mess
      const memberId = getSelfMember(args.guildId)(state())!.id;
      dispatch(members.removed({ memberId }));
    });
    // listen to passive events (not received by api middleware)
    ws.on('GUILD_MEMBER_ADD', (args) => {
      // we not getting other users when joining guild
      dispatch(users.fetched([args.user]));
      dispatch(members.added(args));      
    });
    ws.on('GUILD_MEMBER_UPDATE', (args) => dispatch(members.updated(args)));
    // user may be in mutual guilds, and therefore not removed from global user cache
    ws.on('GUILD_MEMBER_REMOVE', (args) => dispatch(members.removed(args)));
    ws.on('GUILD_ROLE_CREATE', (args) => dispatch(roles.created(args)));
    ws.on('GUILD_ROLE_DELETE', (args) => dispatch(roles.deleted(args)));
    ws.on('GUILD_ROLE_UPDATE', (args) => dispatch(roles.updated(args)));
    ws.on('GUILD_UPDATE', (args) => dispatch(guilds.updated(args)));
    ws.on('INVITE_CREATE', (args) => {
      dispatch(invites.created(args));
      dispatch(uiActions.focusedInvite(args.invite));
    });
    ws.on('INVITE_DELETE', (args) => dispatch(invites.deleted(args)));
    ws.on('MESSAGE_CREATE', (args) => {
      const selfUser = state().auth.user!;
      const isBlocked = selfUser.ignored?.userIds.includes(args.message.authorId);
      if (isBlocked) return;

      dispatch(messages.created(args));
      
      const { channelId } = args.message;
      const { activeChannel } = state().ui;
      if (activeChannel && activeChannel.id !== channelId)
        addPing(channelId);
    });
    ws.on('MESSAGE_DELETE', (args) => dispatch(messages.deleted(args)));
    ws.on('MESSAGE_UPDATE', (args) => dispatch(messages.updated(args)));
    ws.on('PRESENCE_UPDATE', ({ userId, status }) =>
      dispatch(users.updated({ userId, partialUser: { status } })));
    ws.on('READY', (args) => {
      dispatch(fetchEntities());
      dispatch(auth.ready(args));
      dispatch(users.fetched([args.user]));
    });
    ws.on('TYPING_START', (args) => {
      dispatch(typing.userTyped(args));

      const timeoutMs = 5000;
      setTimeout(() => dispatch(typing.userStoppedTyping(args)), timeoutMs);
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
    ws.on('VOICE_STATE_UPDATE', async ({ userId, voice }) => {
      const data = { userId, partialUser: { voice } };
      const selfUser = state().auth.user!;
      if (selfUser.id === userId)
        dispatch(auth.updatedUser(data));
      dispatch(users.updated(data));

      (voice.channelId)
        // if in channel
        ? await startVoiceFeedback(voice.channelId)
        : stopVoiceFeedback();
    });

    dispatch(meta.listenedToWS());
  }, [hasListened]);
  
  return null;
}
 
export default WSListener;
import { useDispatch, useSelector } from 'react-redux';
import ws from '../store/services/ws';
import { actions as guilds } from '../store/guilds';
import { actions as messages } from '../store/messages';
import { actions as channels } from '../store/channels';
import { actions as auth } from '../store/auth';
import { focusedInvite } from '../store/ui';
import { useEffect } from 'react';
import { actions as meta } from '../store/meta';

// should this go in guilds reducer file?
const WSListener: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const hasListenedToWS = useSelector((s: Store.AppStore) => s.meta.hasListenedToWS);

  useEffect(() => {
    if (hasListenedToWS) return;

    ws.on('error', (error: any) => alert(error?.message));

    // listen to passive events (not received by api middleware)
    ws.on('GUILD_MEMBER_ADD', (args) => dispatch(guilds.memberAdded(args)));
    ws.on('GUILD_MEMBER_REMOVE', (args) => dispatch(guilds.memberRemoved(args)));
    ws.on('INVITE_CREATE', (args) => {
      dispatch(guilds.inviteCreated(args));
      dispatch(focusedInvite(args.invite));
    });
    ws.on('GUILD_CREATE', (args) => {
      dispatch(guilds.created(args));
      window.location.href = `/channels/${args.guild}`;
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
import { Router } from 'express';
import Channels from '../../data/channels';
import Messages from '../../data/messages';
import { SelfUserDocument } from '../../data/models/user';
import Pings from '../../data/pings';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { updateUser, validateUser } from '../modules/middleware';
import { WebSocket } from '../../ws/websocket';
import { WSGuard } from '../../ws/modules/ws-guard';
import { APIError } from '../modules/api-error';

export const router = Router();

const channels = deps.channels;
const messages = deps.messages;
const pings = deps.pings;
const ws = deps.webSocket;
const guard = deps.wsCooldowns;

router.get('/:channelId/messages', updateUser, validateUser, async (req, res) => {
  const channelId = req.params.channelId;
  const user: SelfUserDocument = res.locals.user;

  const canAccess = guard.canInChannel('READ_MESSAGES', channelId, user.id);
  if (!canAccess)
    throw new APIError(403, 'Insufficient permissions');

  const channelMsgs = (await messages
    .getChannelMessages(channelId) ?? await messages
    .getDMChannelMessages(channelId, res.locals.user.id));  

  const batchSize = 25;
  const back = Math.max(channelMsgs.length - +(req.query.back || batchSize), 0);
  
  const slicedMsgs = channelMsgs
    .slice(back)
    .filter(m => !user.ignored?.userIds.includes(m.authorId));

  const index = slicedMsgs.length - 1;
  const lastMessage = slicedMsgs[index];
  if (lastMessage) {
    await pings.markAsRead(user, lastMessage);
    ws.io
      .to(user.id)
      .emit('USER_UPDATE', {
        userId: user.id,
        partialUser: {
          lastReadMessageIds: user.lastReadMessageIds
        },
      } as WS.Args.UserUpdate);
  }
  
  res.json(slicedMsgs);
});

router.get('/:id', updateUser, validateUser, async (req, res) => {
  const channel = await channels.get(req.params.id);
  res.json(channel);
});


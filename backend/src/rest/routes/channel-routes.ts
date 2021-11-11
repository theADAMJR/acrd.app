import { Router } from 'express';
import { SelfUserDocument } from '../../data/models/user';
import { WS } from '../../types/ws';

import { APIError } from '../modules/api-error';
import updateUser from '../middleware/update-user';
import validateUser from '../middleware/validate-user';

export const router = Router();

router.get('/:channelId/messages', updateUser, validateUser, async (req, res) => {
  const channelId = req.params.channelId;
  const user: SelfUserDocument = res.locals.user;

  const canAccess = deps.wsGuard.canInChannel('READ_MESSAGES', channelId, user.id);
  if (!canAccess)
    throw new APIError(403, 'Insufficient permissions');

  const channelMsgs = (
    await deps.messages.getChannelMessages(channelId)
    ?? await deps.messages.getDMChannelMessages(channelId, res.locals.user.id)
  );  

  const batchSize = 25;
  const back = Math.max(channelMsgs.length - +(req.query.back || batchSize), 0);
  
  const slicedMsgs = channelMsgs
    .slice(back)
    .filter(m => !user.ignored?.userIds.includes(m.authorId));

  const index = slicedMsgs.length - 1;
  const lastMessage = slicedMsgs[index];
  if (lastMessage) {
    await deps.pings.markAsRead(user, lastMessage);
    deps.webSocket.io
      .to(user.id)
      .emit('USER_UPDATE', {
        userId: user.id,
        partialUser: {
          lastReadMessageIds: user.lastReadMessageIds
        },
      } as WS.Args.UserUpdate);
  }
  
  res.json({
    channelId,
    total: channelMsgs.length,
    list: slicedMsgs,
  } as REST.From.Get['/channels/:channelId/messages']);
});

router.get('/:id', updateUser, validateUser, async (req, res) => {
  const channel = await deps.channels.get(req.params.id);
  res.json(channel);
});


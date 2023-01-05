import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import striptags from 'striptags';
import { WS } from '@acrd/types';
import ProfanityFilter from 'bad-words';

export default class implements WSEvent<'MESSAGE_CREATE'> {
  on = 'MESSAGE_CREATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { attachmentURLs, channelId, content, embed }: WS.Params.MessageCreate) {
    const authorId = ws.sessions.userId(client);

    const [_, channel, author] = await Promise.all([
      deps.wsGuard.validateCanInChannel(client, channelId, 'SEND_MESSAGES'),
      deps.channels.getText(channelId),
      deps.users.getSelf(authorId),
    ]);

    if (attachmentURLs && attachmentURLs.length > 0)
      await deps.wsGuard.validateCanInChannel(client, channelId, 'SEND_FILES');

    var message = await deps.messages.create(authorId, channelId, {
      attachmentURLs,
      content: this.filterContent(content, channel.filterProfanity),
      embed,
    });

    channel.lastMessageId = message.id;
    await channel.save();

    author.lastReadMessageIds ??= {};
    author.lastReadMessageIds[channelId] = message.id;
    await author.save();

    return [{
      emit: this.on,
      to: [channelId],
      send: { message },
    }];
  }

  private filterContent(content: string | undefined, filterProfanity: boolean) {
    const badWords = new ProfanityFilter({ placeHolder: '?' });

    // server filters tags, client renders them as is
    const innerMentionPattern = /.\d{18}/gm;
    const allowedTags = content?.match(innerMentionPattern) ?? [];

    if (content && filterProfanity)
      return badWords.clean(content);
    else if (content)
      return content;
    return '';
  }
}
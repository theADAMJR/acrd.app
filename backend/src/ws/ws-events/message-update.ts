import { Entity, WS } from '@acrd/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import ProfanityFilter from 'bad-words';
import striptags from 'striptags';

export default class implements WSEvent<'MESSAGE_UPDATE'> {
  public on = 'MESSAGE_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { messageId, content, embed }: WS.Params.MessageUpdate) {
    const message = await deps.messages.get(messageId);
    const channel = await deps.channels.get(message.channelId);

    deps.wsGuard.validateIsUser(client, message.authorId);

    const partial: Partial<Entity.Message> = {};
    if (content) partial.content = this.filterContent(content, channel.filterProfanity);
    if (embed) partial.embed = embed;
    partial.updatedAt = new Date();

    Object.assign(message, partial);
    await message.save();

    return [{
      emit: this.on,
      to: [message.channelId],
      send: { messageId, partialMessage: partial },
    }];
  }

  private filterContent(content: string | undefined, filterProfanity: boolean) {
    const badWords = new ProfanityFilter({ placeHolder: '?' });
    if (content && filterProfanity)
      return striptags(badWords.clean(content));
    else if (content)
      return striptags(content);
    return '';
  }
}

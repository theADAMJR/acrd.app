import ChannelDelete from '../../../src/ws/ws-events/channel-delete';
import { given, test } from '@accord/ion';
import { WebSocket } from '../../../src/ws/websocket';
import { WS } from '../../../src/types/ws';

test(channelDelete, () => {
  before(() => console.log('before'));

  given({}).rejectWith('Channel not found');

  after(() => console.log('after'));
});

async function channelDelete(args: WS.To['CHANNEL_DELETE']) {
  await import('../../../src/modules/deps');
  global['log'] = console;

  const event = new ChannelDelete();
  return event.invoke(new WebSocket(), {} as any, args);
}
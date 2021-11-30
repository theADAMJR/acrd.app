import ChannelDelete from '../../../src/ws/ws-events/channel-delete';
import { given, test } from '@accord/ion';
import { WebSocket } from '../../../src/ws/websocket';

test(channelDelete, () => {
  given({}).rejectWith('Channel not found');
  given({}).rejectWith('Channel not found');
});

async function channelDelete(args: WS.To['CHANNEL_DELETE']) {
  await import('../../../src/modules/deps');
  console.error = () => {};
  global['log'] = console;

  const event = new ChannelDelete();
  return event.invoke(new WebSocket(), {} as any, args);
}
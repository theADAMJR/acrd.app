import ChannelDelete from '../../../src/ws/ws-events/channel-delete';
import { given, test } from 'sazerac';
import { WebSocket } from '../../../src/ws/websocket';
import { WS } from '../../../src/types/ws';
import SynchronousPromise from 'synchronous-promise';

test(channelDelete, () => {
  given().expectError('Channel not found');
});

function channelDelete(args: WS.To['CHANNEL_DELETE']) {
  const event = new ChannelDelete();
  return new SynchronousPromise(event.invoke.bind(event))(new WebSocket(), {} as any, args);
}
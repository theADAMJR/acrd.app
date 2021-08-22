import RemoveFriend from '../../../src/api/websocket/ws-events/remove-friend';
import { WebSocket } from '../../../src/api/websocket/websocket';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { expect } from 'chai';
import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { SelfUserDocument, User, UserDocument } from '../../../src/data/models/user';

describe('remove-friend', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  let event: RemoveFriend;
  let ws: WebSocket;

  let sender: SelfUserDocument;
  let friend: SelfUserDocument;

  beforeEach(async () => {
    ({ event, ws, user: sender as any } = await Mock.defaultSetup(client, RemoveFriend));
    friend = await Mock.self();
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('user sends request, fulfilled', async () => {
    await expect(removeFriend()).to.be.fulfilled;
  });

  it('user removes self as friend, rejected', async () => {
    friend.id = sender.id;

    await expect(removeFriend()).to.be.rejectedWith('You cannot remove yourself as a friend');
  });

  it('removes non existing friend, rejected', async () => {
    friend.id = generateSnowflake();

    await expect(removeFriend()).to.be.rejectedWith('User Not Found');
  });

  it('sender cancels request, friend request removed', async () => {
    await removeFriend();

    sender = await User.findById(sender.id) as any;   

    expect(sender.friendRequestIds).to.be.empty;
  });

  it('sender removes friend, friend removed on both users', async () => {
    await removeFriend();

    friend = await User.findById(friend.id) as any;
    sender = await User.findById(sender.id) as any;

    expect(friend.friendIds.length).to.equal(0);
    expect(sender.friendIds.length).to.equal(0);
  });

  async function removeFriend() {
    return event.invoke(ws, client, { friendId: friend.id });
  }
});

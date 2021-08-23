import { Socket } from 'socket.io';
import Channels from '../../../data/channels';
import { Channel, DMChannelDocument } from '../../../data/models/channel';
import { SelfUserDocument, User, UserDocument } from '../../../data/models/user';
import Users from '../../../data/users';
import Deps from '../../../utils/deps';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'ADD_FRIEND'> {
  on = 'ADD_FRIEND' as const;

  constructor(
    private channels = Deps.get<Channels>(Channels),
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { username }: WS.Params.AddFriend) {
    const senderId = ws.sessions.userId(client);
    let sender = await this.users.getSelf(senderId);
    let friend = await this.users.getByUsername(username);

    if (sender.friendRequestIds.includes(friend.id))
      throw new TypeError('Friend request already sent');
    else if (sender.friendIds.includes(friend.id))
      throw new TypeError('You are already friends');

    const isBlocking = friend.ignored.userIds.includes(sender.id);    
    console.log(friend.ignored.userIds);
    if (isBlocking)
      throw new TypeError('This user is blocking you');
    
    let dmChannel: DMChannelDocument;
    ({ sender, friend, dmChannel } = await this.handle(sender, friend) as any);
    
    if (dmChannel)    
      await client.join(dmChannel.id);

    ws.io
      .to(senderId)
      .to(friend.id)
      .emit('ADD_FRIEND', {
        sender: this.users.secure(sender),
        friend: this.users.secure(friend),
      } as WS.Args.AddFriend);
  }

  private async handle(sender: SelfUserDocument, friend: SelfUserDocument): Promise<WS.Args.AddFriend> {
    if (sender.id === friend.id)
      throw new TypeError('You cannot add yourself as a friend');
      
    const hasReturnedRequest = friend.friendRequestIds.includes(sender.id);
    if (hasReturnedRequest) return {
      friend: await this.acceptRequest(friend, sender),
      sender: await this.acceptRequest(sender, friend),
      dmChannel: await this.channels.getDMByMembers(sender.id, friend.id)
        ?? await this.channels.createDM(sender.id, friend.id),
    }
      
    const hasSentRequest = sender.friendRequestIds.includes(friend.id);
    if (!hasSentRequest)
      await this.sendRequest(sender, friend);

    return { sender, friend };
  }

  private async sendRequest(sender: SelfUserDocument, friend: UserDocument) {
    sender.friendRequestIds.push(friend.id);
    return sender.save();
  }

  private async acceptRequest(sender: SelfUserDocument, friend: SelfUserDocument) {    
    const friendExists = sender.friendIds.includes(friend.id);
    if (friendExists) return friend;
    
    const index = sender.friendRequestIds.indexOf(friend.id);
    sender.friendRequestIds.splice(index, 1);
    sender.friendIds.push(friend.id);
    return sender.save();
  }
}

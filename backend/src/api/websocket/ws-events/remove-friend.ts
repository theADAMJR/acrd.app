import { Socket } from 'socket.io';
import { SelfUserDocument } from '../../../data/models/user';
import Users from '../../../data/users';
import Deps from '../../../utils/deps';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'REMOVE_FRIEND'> {
  on = 'REMOVE_FRIEND' as const;

  constructor(
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { friendId }: WS.Params.RemoveFriend) {
    const senderId = ws.sessions.userId(client);
    let sender = await this.users.getSelf(senderId);
    let friend = await this.users.getSelf(friendId);

    ({ sender, friend } = await this.handle(sender, friend) as any);

    ws.io
      .to(senderId)
      .to(friendId)
      .emit('REMOVE_FRIEND', {
        sender: this.users.secure(sender),
        friend: this.users.secure(friend),
      } as WS.Args.RemoveFriend);
  }

  private async handle(sender: SelfUserDocument, friend: SelfUserDocument): Promise<WS.Args.RemoveFriend> {
    if (sender.id === friend.id)
      throw new TypeError('You cannot remove yourself as a friend');
    
    await this.removeFriend(sender, friend);
    await this.removeFriend(friend, sender);

    return { sender, friend };
  }

  private async removeFriend(sender: SelfUserDocument, friend: SelfUserDocument) {
    const friendIndex = sender.friendIds.indexOf(friend.id);
    sender.friendIds.splice(friendIndex, 1);
    
    const requestIndex = sender.friendRequestIds.indexOf(friend.id);
    sender.friendRequestIds.splice(requestIndex, 1);
    return sender.save(); 
  }
}

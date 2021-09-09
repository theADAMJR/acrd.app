import { SelfUserDocument } from './models/user';

export default class Pings {
  public markAsRead(user: SelfUserDocument, message: Entity.Message) {
    user.lastReadMessageIds[message.channelId] = message.id;
    return user.updateOne(user);
  }
}

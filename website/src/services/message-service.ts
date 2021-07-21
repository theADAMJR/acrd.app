import { RESTService } from './rest-service';

export class MessageService extends RESTService {
  protected endpoint = `messages`;
  private messages = new Map<string, Entity.Message[]>();

  public async init() {
    this.messages = await this.fetchAll();
  }

  public async fetchAll() {
    return this.get('/');
  }

  public getAll(channelId: string) {
    return this.messages.get(channelId) ?? [];
  }

  public create(message: Entity.Message) {
    const channelMsgs = this.getAll(message.channelId) ?? [];
    this.messages.set(
      message.channelId,
      channelMsgs?.concat(message),
    );
  }
}
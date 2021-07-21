import { RESTService } from './rest-service';

export class MessageService extends RESTService {
  protected endpoint = `messages`;

  public fetchAll() {
    return this.get('/');
  }
}
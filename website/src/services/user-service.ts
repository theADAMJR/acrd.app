import { RESTService } from './rest-service';

export class UserService extends RESTService {
  protected endpoint = `users`;

  public fetchAll() {
    return this.get('/');
  }
}
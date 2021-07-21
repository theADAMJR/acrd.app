import { RESTService } from './rest-service';

export class UserService extends RESTService {
  protected endpoint = process.env.API_ENDPOINT;

  constructor() {}
}
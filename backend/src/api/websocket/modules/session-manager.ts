import { Socket } from 'socket.io';
import { patterns } from '../../../types/permission-types';

export class SessionManager extends Map<string, string> {
  public get(key: string): string  {
    const userId = super.get(key);    
    if (!userId)
      throw new TypeError('User Not Logged In');

    if (!patterns.snowflake.test(userId))
      throw new TypeError('Spoofed ID Not Allowed');
    return userId;
  }

  public userId(client: Socket) {
    return this.get(client.id);
  }
}
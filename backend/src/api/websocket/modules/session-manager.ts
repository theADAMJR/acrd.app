import { Socket } from 'socket.io';
import patterns from '../../../types/patterns';

export class SessionManager extends Map<string, string> {
  public get(token: string): string {
    const userId = super.get(token);
    if (!userId)
      throw new TypeError('User not logged in');

    if (!patterns.snowflake.test(userId))
      throw new TypeError('Spoofed ID Not Allowed');
    return userId;
  }

  public userId(client: Socket) {
    return this.get(client.id);
  }
}
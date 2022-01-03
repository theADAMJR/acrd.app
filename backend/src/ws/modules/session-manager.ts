import { Socket } from 'socket.io';
import { patterns } from '@accord/types';

export class SessionManager extends Map<string, string> {
  public get(clientId: string): string {
    const userId = super.get(clientId);
    if (!userId)
      throw new TypeError('User not logged in');

    if (!patterns.snowflake.test(userId))
      throw new TypeError('Spoofed ID Not Allowed');
    return userId;
  }

  public userId(client: Socket) {
    return this.get(client.id);
  }

  public getClientIdFromUserId(userId: string) {
    return Array
      .from(this.entries())
      .find(([key, value]) => value === userId)?.[0];
  }
}
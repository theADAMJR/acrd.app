import { Socket } from 'socket.io';
import Users from '../../data/users';
import { EmailFunctions } from '../../email/email-functions';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'VOICE_DATA'> {
  on = 'VOICE_DATA' as const;

  constructor(
    private users = Deps.get<Users>(Users),
    private guard = Deps.get<WSGuard>(WSGuard),
    private sendEmail = Deps.get<EmailFunctions>(EmailFunctions),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, {}: WS.Params.VoiceData) {
    client.emit('VOICE_DATA', {} as WS.Args.VoiceData);
  }
}

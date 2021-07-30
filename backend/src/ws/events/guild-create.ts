import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_CREATE'> {
  public on = 'GUILD_CREATE' as const;

  
}
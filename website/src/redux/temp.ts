import { snowflake } from '../utils/src/snowflake';
import { AppStore } from './store';

const guilds: Entity.Guild[] = [
  {
    createdAt: new Date(),
    id: snowflake.generate(),
    iconURL: '',
    channels: [],
    members: [],
    name: 'Epic Guild',
    ownerId: 'nobody',
  },
];

const channels: Entity.Channel[] = [
  {
    id: snowflake.generate(),
    createdAt: new Date(),
    guildId: guilds[0].id,
    name: 'general',
  }
];
guilds[0].channels = channels;

const temp: AppStore = {
  activeChannel: channels[0],
  activeGuild: guilds[0],
  guilds,
  users: [],
  messages: new Map(),
};

export default temp;
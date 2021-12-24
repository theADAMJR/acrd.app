import { Email } from '../email/email';
import { EmailFunctions } from '../email/email-functions';
import { Verification } from '../email/verification';
import { REST } from '../rest/server';
import { VoiceService } from '../voice/voice-service';
import { WSCooldowns } from '../ws/modules/ws-cooldowns';
import { WSGuard } from '../ws/modules/ws-guard';
import { WSRooms } from '../ws/modules/ws-rooms';
import { WebSocket } from '../ws/websocket';
import Channels from '../data/channels';
import GuildMembers from '../data/guild-members';
import Guilds from '../data/guilds';
import Invites from '../data/invites';
import Messages from '../data/messages';
import Pings from '../data/pings';
import Roles from '../data/roles';
import Users from '../data/users';
import ChannelJoin from '../ws/ws-events/channel-join';
import ChannelLeave from '../ws/ws-events/channel-leave';
import Themes from '../data/themes';

export interface Deps {
  channels: Channels;
  /** @deprecated */
  channelJoin: ChannelJoin;
  /** @deprecated */
  channelLeave: ChannelLeave;
  email: Email;
  emailFunctions: EmailFunctions;
  guilds: Guilds;
  guildMembers: GuildMembers;
  invites: Invites;
  messages: Messages;
  /** @deprecated */
  pings: Pings;
  rest: REST;
  roles: Roles;
  themes: Themes;
  users: Users;
  wsCooldowns: WSCooldowns;
  wsGuard: WSGuard;
  wsRooms: WSRooms;
  webSocket: WebSocket;
  verification: Verification;
  voiceService: VoiceService;
};

const deps: Deps = {
  channels: new Channels(),
  channelJoin: new ChannelJoin(),
  channelLeave: new ChannelLeave(),
  email: new Email(),
  emailFunctions: new EmailFunctions(),
  guilds: new Guilds(),
  guildMembers: new GuildMembers(),
  invites: new Invites(),
  messages: new Messages(),
  pings: new Pings(),
  rest: new REST(),
  roles: new Roles(),
  themes: new Themes(),
  users: new Users(),
  wsCooldowns: new WSCooldowns(),
  wsGuard: new WSGuard(),
  wsRooms: new WSRooms(),
  webSocket: new WebSocket(),
  verification: new Verification(),
  voiceService: new VoiceService(),
};

global['deps'] = deps;
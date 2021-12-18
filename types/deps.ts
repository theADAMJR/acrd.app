import { Email } from '@accord/backend/src/email/email';
import { EmailFunctions } from '@accord/backend/src/email/email-functions';
import { Verification } from '@accord/backend/src/email/verification';
import { REST } from '@accord/backend/src/rest/server';
import { VoiceService } from '@accord/backend/src/voice/voice-service';
import { WSCooldowns } from '@accord/backend/src/ws/modules/ws-cooldowns';
import { WSGuard } from '@accord/backend/src/ws/modules/ws-guard';
import { WSRooms } from '@accord/backend/src/ws/modules/ws-rooms';
import { WebSocket } from '@accord/backend/src/ws/websocket';
import Channels from '@accord/backend/src/data/channels';
import GuildMembers from '@accord/backend/src/data/guild-members';
import Guilds from '@accord/backend/src/data/guilds';
import Invites from '@accord/backend/src/data/invites';
import Messages from '@accord/backend/src/data/messages';
import Pings from '@accord/backend/src/data/pings';
import Roles from '@accord/backend/src/data/roles';
import Users from '@accord/backend/src/data/users';
import ChannelJoin from '@accord/backend/src/ws/ws-events/channel-join';
import ChannelLeave from '@accord/backend/src/ws/ws-events/channel-leave';

declare interface Deps {
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
  users: Users;
  wsCooldowns: WSCooldowns;
  wsGuard: WSGuard;
  wsRooms: WSRooms;
  webSocket: WebSocket;
  verification: Verification;
  voiceService: VoiceService;
}
export default Deps;
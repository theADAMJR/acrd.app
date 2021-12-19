import { Email } from '@accord/backend/email/email';
import { EmailFunctions } from '@accord/backend/email/email-functions';
import { Verification } from '@accord/backend/email/verification';
import { REST } from '@accord/backend/rest/server';
import { VoiceService } from '@accord/backend/voice/voice-service';
import { WSCooldowns } from '@accord/backend/ws/modules/ws-cooldowns';
import { WSGuard } from '@accord/backend/ws/modules/ws-guard';
import { WSRooms } from '@accord/backend/ws/modules/ws-rooms';
import { WebSocket } from '@accord/backend/ws/websocket';
import Channels from '@accord/backend/data/channels';
import GuildMembers from '@accord/backend/data/guild-members';
import Guilds from '@accord/backend/data/guilds';
import Invites from '@accord/backend/data/invites';
import Messages from '@accord/backend/data/messages';
import Pings from '@accord/backend/data/pings';
import Roles from '@accord/backend/data/roles';
import Users from '@accord/backend/data/users';
import ChannelJoin from '@accord/backend/ws/ws-events/channel-join';
import ChannelLeave from '@accord/backend/ws/ws-events/channel-leave';

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
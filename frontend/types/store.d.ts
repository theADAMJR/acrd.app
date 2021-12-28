declare namespace Store {
  import { Entity, UserTypes } from '@accord/types';

  export interface AppState {
    auth: {
      attemptedLogin: boolean;
      shouldVerify: boolean;
      user?: UserTypes.Self;
    };
    config: {
      devMode: boolean;
      memberListToggled: boolean;
    };
    entities: {
      typing: { userId: string, channelId: string }[];
      channels: Entity.Channel[];
      guilds: Entity.Guild[];
      members: Entity.GuildMember[];
      pings: { [guildId: string]: string[] };
      roles: Entity.Role[];
      users: Entity.User[];
      themes: Entity.Theme[];
      // sequential - loaded when needed
      invites: {
        fetched: string[];
        list: Entity.Invite[];
      };
      messages: {
        total: { [channelId: string]: number; }
        list: Entity.Message[];
      };
    };
    meta: {
      fetchedEntities: boolean;
      hasListenedToWS: boolean;
      ping?: number;
      userCount?: number;
    };
    ui: {
      openDropdown?: string;
      openModal?: string;
      activeChannel?: Entity.Channel;
      activeResource?: string;
      activeGuild?: Entity.Guild;
      activeInvite?: Entity.Invite;
      activeUser?: Entity.User;
      editingMessageId?: string;
      saveChangesOpen?: boolean;
    };
  }

  export interface Action<P extends WS.To> {
    type: string;
    payload: P;
  }
}
declare namespace Store {
  export interface AppState {
    auth: {
      user?: UserTypes.Self;
      attemptedLogin: boolean;
    };
    config: {
      memberListToggled: boolean;
    };
    entities: {
      typing: { userId: string, channelId: string }[];
      channels: Entity.Channel[];
      guilds: Entity.Guild[];
      members: Entity.GuildMember[];
      roles: Entity.Role[];
      users: Entity.User[];
      // sequential - loaded when needed
      invites: {
        fetched: string[];
        list: Entity.Invite[];
      };
      // sequential - loaded when needed
      messages: {
        /** Set of channel Ids that messages have been initially fetched in. */
        fetched: string[];
        list: Entity.Message[];
      }
    };
    meta: {
      fetchedEntities: boolean;
      hasListenedToWS: boolean;
    };
    ui: {
      openDropdown?: string;
      openModal?: string;
      activeChannel?: Entity.Channel;
      activeGuild?: Entity.Guild;
      activeInvite?: Entity.Invite;
      editingMessageId?: string;
    };
  }

  export interface Action<P extends WS.Params> {
    type: string;
    payload: P;
  }
}
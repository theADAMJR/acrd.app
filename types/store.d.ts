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
      channels: {
        typing: { userId: string, channelId: string }[];
      };
      guilds: {
        fetched: boolean;
        list: Entity.Guild[];
      }
      messages: Entity.Message[];
      users: {
        fetched: boolean;
        list: Entity.User[];
      }
    };
    meta: {
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
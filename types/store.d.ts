declare namespace Store {
  export interface AppStore {
    auth: {
      user?: Entity.User;
      attemptedLogin: boolean;
    };
    entities: {
      channels: {
        typing: { userId: string, channelId: string }[];
      };
      guilds: Entity.Guild[];
      messages: Entity.Message[];
      users: Entity.User[];
    };
    // metadata about store
    meta: {
      hasListenedToWS: boolean;
    };
    ui: {
      openModal?: string;
      activeChannel?: Entity.Channel;
      activeGuild?: Entity.Guild;
      activeInvite?: Entity.Invite;
    };
  }  
}
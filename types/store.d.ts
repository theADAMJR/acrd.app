declare namespace Store {
  export interface AppStore {
    auth: {
      user?: Entity.User;
      attemptedLogin: boolean;
    };
    entities: {
      guilds: Entity.Guild[];
      messages: Entity.Message[];
      users: Entity.User[];
    };
    ui: {
      openModal?: string;
      activeChannel?: Entity.Channel;
      activeGuild?: Entity.Guild;
      activeInvite?: Entity.Invite;
    }
  }  
}
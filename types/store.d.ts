declare namespace Store {
  export interface AppStore {
    auth: {
      user?: Entity.User;
    };
    entities: {
      guilds: Entity.Guild[];
      messages: Entity.Message[];
      users: Entity.User[];
    };
    ui: {
      activeGuild?: Entity.Guild;
      activeChannel?: Entity.Channel;
    }
  }  
}
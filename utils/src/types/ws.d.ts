declare global {
  export interface WSToAPI extends WSOnAPI {
    'MESSAGE_CREATE': Params.MessageCreate;
    'MESSAGE_DELETE': Params.MessageDelete;
    'READY': Params.Ready;
    'TYPING_START': Params.TypingStart;
  }

  export interface WSOnAPI {
    'disconnect': any;
    'message': string;
  }

  export interface WSFromAPI {
    'MESSAGE_CREATE': (args: Args.MessageCreate) => any;
    'MESSAGE_DELETE': (args: Args.MessageDelete) => any;
    'READY': (args: Args.Ready) => any;
    'TYPING_START': (args: Args.TypingStart) => any;
  }

  export namespace Params {
    export interface MessageCreate {
      content: string;
    }
    export interface MessageDelete {
      messageId: string;
    }
    export interface Ready {}
    export interface TypingStart {}
  }
  
  export namespace Args {
    export interface MessageCreate {
      authorId: string;
      content: string;
    }
    export interface MessageDelete {
      messageId: string;
    }
    export interface Ready extends Entity.User {}
    export interface TypingStart {}
  }
}
export {};
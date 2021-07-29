// TODO: declare own module
declare global {
  export interface ToWSAPI {
    'MESSAGE_CREATE': Params.MessageCreate;
    'MESSAGE_DELETE': Params.MessageDelete;
    'READY': Params.Ready;
    'TYPING_START': Params.TypingStart;
  }

  export interface OnWSAPI {
    'disconnect': any;
    'message': string;
  }

  export interface FromWSAPI {
    'MESSAGE_CREATE': Args.MessageCreate;
    'MESSAGE_DELETE': Args.MessageDelete;
    'READY': Args.Ready;
    'TYPING_START': Args.TypingStart;
  }

  export namespace Params {
    export interface MessageCreate {
      channelId: string;
      content: string;
    }
    export interface MessageDelete {
      messageId: string;
    }
    export interface Ready {
      token: string;
    }
    export interface TypingStart {
      channelId: string;
    }
  }
  
  export namespace Args {
    export interface MessageCreate {
      message: Entity.Message;
    }
    export interface MessageDelete {
      messageId: string;
    }
    export interface Ready {
      user: Entity.User;
    }
    export interface TypingStart {
      channelId: string;
    }
  }
}
export {};
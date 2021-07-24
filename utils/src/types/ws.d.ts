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
      message: Entity.Message;
    }
    export interface MessageDelete {
      messageId: string;
    }
    export interface Ready extends Entity.User {}
    export interface TypingStart {}
  }
}
export {};
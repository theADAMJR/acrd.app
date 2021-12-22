export namespace Auth {
  export interface Credentials {
    email?: string;
    password: string;
    username: string;
  }
  export interface Payload {
    userId: string;
  }
}
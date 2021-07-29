declare namespace Auth {
  export interface Credentials {
    password: string;
    username: string;
  }
  export interface Payload {
    userId: string;
  }
}
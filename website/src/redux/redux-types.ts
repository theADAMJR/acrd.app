import { Dispatch } from "redux";

// expected json response from server
export interface RESTArgs {
  'FETCH_CHANNELS': Entity.Channel[];
  'FETCH_GUILDS': Entity.Guild[];
  'FETCH_MESSAGES': Entity.Message[];
  'FETCH_USERS': Entity.User[];
}

interface WSAction<T extends keyof WSEventParams> {
  type: T;
  payload: WSEventParams[T];
}
interface RESTAction<T extends keyof RESTArgs> {
  type: T;
  payload: RESTArgs[T];
}

export interface APIDispatch {
  <T extends keyof WSEventParams>(action: WSAction<T>): WSAction<T>;
}
export interface APIDispatch {
  <T extends keyof RESTArgs>(action: RESTAction<T>): RESTAction<T>;
}
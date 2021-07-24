export interface FromRestAPI {
  'FETCH_CHANNELS': Entity.Channel[];
  'FETCH_GUILDS': Entity.Guild[];
  'FETCH_MESSAGES': Entity.Message[];
  'FETCH_USERS': Entity.User[];
}

interface WSAction<K extends keyof WSToAPI> {
  type: K;
  payload: WSToAPI[K];
}
interface RestAction<K extends keyof FromRestAPI> {
  type: K;
  payload: FromRestAPI[K];
}

export interface APIDispatch {
  <K extends keyof WSToAPI>(action: WSAction<K>): WSAction<K>;
}
export interface APIDispatch {
  <K extends keyof FromRestAPI>(action: RestAction<K>): RestAction<K>;
}

export type Action = WSAction<keyof WSToAPI> | RestAction<keyof FromRestAPI>; 
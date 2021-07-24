export interface FromRestAPI {
  'FETCH_CHANNELS': Entity.Channel[];
  'FETCH_GUILDS': Entity.Guild[];
  'FETCH_MESSAGES': Entity.Message[];
  'FETCH_USERS': Entity.User[];
}

interface WSAction<K extends keyof ToWSAPI> {
  type: K;
  payload: ToWSAPI[K];
}
interface RestAction<K extends keyof FromRestAPI> {
  type: K;
  payload: FromRestAPI[K];
}

export interface APIDispatch {
  <K extends keyof ToWSAPI>(action: WSAction<K>): WSAction<K>;
}
export interface APIDispatch {
  <K extends keyof FromRestAPI>(action: RestAction<K>): RestAction<K>;
}

// TODO: perfectionism - How to not require as assertions here?
export interface Action {
  type: keyof FromWSAPI | keyof FromRestAPI,
  payload: any;
}
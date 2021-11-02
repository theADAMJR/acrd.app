import Users from '../data/users';
import { REST } from '../rest/server';

export interface Deps {
  rest: REST;
  users: Users;
}

const deps: Deps = {
  rest: new REST(),
  users: new Users(),
};

global['deps'] = deps;
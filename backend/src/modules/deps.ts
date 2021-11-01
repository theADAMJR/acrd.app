import { REST } from '../rest/server';

interface Deps {
  rest: REST;
}

export const deps: Deps = {
  rest: new REST(),
};
export default deps;
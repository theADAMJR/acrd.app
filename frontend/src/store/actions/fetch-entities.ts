import { REST } from '@accord/types';
import { actions as api } from '../api';
import { actions as channelActions } from '../channels';
import { actions as guildActions } from '../guilds';
import { actions as memberActions } from '../members';
import { actions as meta } from '../meta';
import { actions as roleActions } from '../roles';
import { actions as themes } from '../themes';
import { actions as userActions } from '../users';
import { getHeaders } from '../utils/rest-headers';

export default () => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [],
    headers: getHeaders(),
    url: `/users/entities`,
    callback: (data: REST.From.Get['/users/entities']) => {
      dispatch(channelActions.fetched(data.channels));
      dispatch(guildActions.fetched(data.guilds));
      dispatch(memberActions.fetched(data.members));
      dispatch(roleActions.fetched(data.roles));
      dispatch(themes.fetched(data.themes));
      dispatch(userActions.fetched(data.users));
      dispatch(meta.fetchedEntities());
    },
  }));  
}
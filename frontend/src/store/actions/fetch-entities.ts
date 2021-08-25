import { actions as api } from '../api';
import { actions as channelActions } from '../channels';
import { actions as guildActions } from '../guilds';
import { actions as memberActions } from '../members';
import { actions as roleActions } from '../roles';
import { actions as userActions } from '../users';
import { actions as inviteActions } from '../invites';
import { headers } from '../utils/rest-headers';

export default () => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [],
    headers: headers(),
    url: `/users/entities`,
    callback: (data: REST.Get['/users/entities']) => {
      dispatch(channelActions.fetched(data.channels));
      dispatch(guildActions.fetched(data.guilds));
      dispatch(memberActions.fetched(data.members));
      dispatch(roleActions.fetched(data.roles));
      dispatch(userActions.fetched(data.users));
    },
  }));  
}
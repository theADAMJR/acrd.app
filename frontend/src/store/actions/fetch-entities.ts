import { actions as api } from '../api';
import { headers } from '../utils/rest-headers';

export default () => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [],
    headers: headers(),
    url: `/auth/register`,
    callback: ({ invites }) => {
      dispatch();
    },
  }));  
}
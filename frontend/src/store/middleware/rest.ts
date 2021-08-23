import axios from 'axios';
import { actions, APIArgs } from '../api';
import env from '../../environment';

export default store => next => async action => {
  if (action.type !== actions.restCallBegan.type)
    return next(action);
  
  const { url, method, data, onSuccess, headers, callback } = action.payload as APIArgs;

  next(action);

  try {
    const { data: payload } = await axios.request({
      baseURL: env.apiURL,
      data,
      method,
      url,
      headers,
    });

    store.dispatch(actions.restCallSucceded(payload));
    if (onSuccess)
      for (const type of onSuccess)
        store.dispatch({ type, payload });

    // called after dispatch events
    callback && callback(payload);
  } catch (error) {
    store.dispatch(actions.restCallFailed(error.response));
  }
};
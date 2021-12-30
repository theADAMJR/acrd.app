import axios from 'axios';
import { actions, APIArgs } from '../api';
import { openDialog } from '../ui';

export default (store) => (next) => async (action) => {
  if (action.type !== actions.restCallBegan.type)
    return next(action);

  const { url, method, data, onSuccess, headers, callback } = action.payload as APIArgs;

  next(action);

  try {
    const { data: payload } = await axios.request({
      baseURL: process.env.REACT_APP_API_URL,
      data,
      method,
      url,
      headers,
    });

    store.dispatch(actions.restCallSucceded({ url, response: payload }));
    if (onSuccess)
      for (const type of onSuccess)
        store.dispatch({ type, payload });

    // called after dispatch events
    if (callback) await callback(payload);
  } catch (error) {
    const response = (error as any).response;
    store.dispatch(actions.restCallFailed({ url, response }));
    store.dispatch(openDialog({
      content: response?.data?.message ?? 'Unknown Error',
      variant: 'error',
    }));
  }
};
import axios from 'axios';
import { actions } from '../api';
import env from '../../environment';

export default store => next => async action => {
  if (action.type !== actions.callBegan.type)
    return next(action);
  
  const { url, method, data, onStart, onSuccess } = action.payload;
  if (onStart)
    store.dispatch({ type: onStart });

  next(action);

  try {
    const { data: payload } = await axios.request({
      baseURL: env.apiURL,
      data,
      method,
      url,
    });

    store.dispatch(actions.callSucceded(payload));
    if (onSuccess)
      store.dispatch({ type: onSuccess, payload });
  } catch (error) {
    store.dispatch(actions.callFailed(error));
  }
};
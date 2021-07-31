import { actions } from '../api';
import ws from '../services/ws';

export default store => next => async action => {
  if (action.type !== actions.wsCallBegan.type)
    return next(action);
  
  const { data, event, onStart, onSuccess, callback } = action.payload;
  if (onStart)
    store.dispatch({ type: onStart });

  next(action);

  const unsub = () => {
    ws.off(event);
    ws.off('error');
  };

  const wrapperCallback = (payload) => {
    unsub();

    onSuccess && store.dispatch({ type: onSuccess, payload });
    store.dispatch(actions.wsCallSucceded(payload));
    callback && callback(payload);
  };
  const errorCallback = (payload) => {
    unsub();
    store.dispatch(actions.wsCallFailed(payload));
  }

  ws.on(event, wrapperCallback);
  ws.on('error', errorCallback);

  ws.emit(event, data);
};
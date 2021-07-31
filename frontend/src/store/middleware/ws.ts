import { actions } from '../api';
import ws from '../services/ws';

export default store => next => async action => {
  if (action.type !== actions.wsCallBegan.type)
    return next(action);
  
  const { data, event } = action.payload;

  next(action);

  const unsub = () => {
    ws.off(event);
    ws.off('error');
  };

  const wrapperCallback = (payload) => {
    store.dispatch(actions.wsCallSucceded(payload));
    unsub();
  };
  const errorCallback = (payload) => {
    unsub();
    store.dispatch(actions.wsCallFailed(payload));
  }

  ws.on(event, wrapperCallback);
  ws.on('error', errorCallback);

  ws.emit(event, data);
};
import { actions } from '../api';
import ws from '../../services/ws-service';

export default (store) => (next) => async (action) => {
  if (action.type !== actions.wsCallBegan.type)
    return next(action);
  
  const { data, event } = action.payload;

  next(action);

  const unsub = () => {
    ws.off(event, wrapperCallback);
    ws.off('error', errorCallback);
  };

  const wrapperCallback = (payload) => {
    unsub();
    store.dispatch(actions.wsCallSucceded({
      event,
      payload,
    }));
  };
  const errorCallback = (payload) => {
    unsub();
    store.dispatch(actions.wsCallFailed({
      event,
      payload,
    }));
  }

  ws.on(event, wrapperCallback);
  ws.on('error', errorCallback);

  ws.emit(event, data);
};
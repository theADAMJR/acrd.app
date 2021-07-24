const initialState = new Map<string, Entity.Message[] | undefined>();

export default function(state = initialState, action: any): typeof initialState {
  const channelId = action.payload?.channelId;
  const messages = state.get(channelId);
  
  if (action.type === 'FETCH_MESSAGES')
    state.set(channelId, action.payload);
  else if (action.type === 'MESSAGE_CREATE')
    messages?.push(action.payload.message);
  else if (action.type === 'MESSAGE_DELETE') {
    const filtered = messages?.filter(m => m.id !== action.payload.id);
    state.set(channelId, filtered);
  }
  return state;
}
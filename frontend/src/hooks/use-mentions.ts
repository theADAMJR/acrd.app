import { useStore } from 'react-redux';
import { MentionService } from '../services/mention-service';

const useMentions = (): MentionService => {
  const state = useStore().getState();
  return new MentionService(state);
}
 
export default useMentions;
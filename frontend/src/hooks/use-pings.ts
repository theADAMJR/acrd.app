import { useStore } from 'react-redux';
import { PingService } from '../services/ping-service';

const usePings = (): PingService => {
  const state = useStore().getState();
  return new PingService(state);  
}

export default usePings;
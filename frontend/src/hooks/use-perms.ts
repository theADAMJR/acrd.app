import { useStore } from 'react-redux';
import { PermService } from '../services/perm-service';

const usePerms = (): PermService => {
  const state = useStore().getState();
  return new PermService(state);
}
 
export default usePerms;
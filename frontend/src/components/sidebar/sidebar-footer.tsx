import './sidebar-footer.scoped.css';
import Username from '../user/username/username';
import { useStore } from 'react-redux';
 
const SidebarFooter: React.FunctionComponent = () => {
  const state = useStore().getState();
  
  return (
    <div className="sidebar-footer background-secondary-alt">
      <Username user={state.auth.user} />
    </div>
  );
}
 
export default SidebarFooter;
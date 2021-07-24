import store from '../redux/store';
import SidebarContent from './sidebar-content';
import SidebarIcons from './sidebar-icons';
import './sidebar.scoped.css';

export interface SidebarProps {
  user: Entity.User;
}
 
const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  let state = store.getState();
  store.subscribe(() => state = store.getState());

  return (
    <div className="sidebar flex">
      <SidebarIcons user={props.user} guilds={state.guilds} />
      <SidebarContent user={props.user} />
    </div>
  );
}
 
export default Sidebar;

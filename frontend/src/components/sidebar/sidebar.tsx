import SidebarContent from './sidebar-content';
import SidebarIcons from './sidebar-icons';

export interface SidebarProps {
  user: Entity.User;
}
 
const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  return (
    <div className="sidebar flex float-left">
      <SidebarIcons />
      <SidebarContent />
    </div>
  );
}
 
export default Sidebar;

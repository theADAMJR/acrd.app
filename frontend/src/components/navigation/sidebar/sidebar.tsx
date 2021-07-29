import SidebarContent from './sidebar-content';
import SidebarIcons from './sidebar-icons';
 
const Sidebar: React.FunctionComponent = (props) => {
  
  return (
    <div className="sidebar flex float-left">
      <SidebarIcons />
      <SidebarContent />
    </div>
  );
}
 
export default Sidebar;

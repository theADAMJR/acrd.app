import Username from '../../user/username/username';
import { useSelector } from 'react-redux';
 
const SidebarFooter: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppStore) => s.auth.user)!;
  
  return (
    <div className="flex items-center sidebar-footer bg-bg-secondary-alt h-14">
      <Username user={user} />
    </div>
  );
}
 
export default SidebarFooter;
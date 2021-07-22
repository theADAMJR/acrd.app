import { temp } from '../utils/src/temp';
import './sidebar-footer.scoped.css';
import Username from './username';

export interface SidebarFooterProps {}
 
const SidebarFooter: React.FunctionComponent<SidebarFooterProps> = () => {
  return (
    <div className="sidebar-footer background-secondary-alt">
      <Username user={temp.users[0]} />
    </div>
  );
}
 
export default SidebarFooter;
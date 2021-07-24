import './sidebar-footer.scoped.css';
import Username from './username';

export interface SidebarFooterProps {
  user: Entity.User;
}
 
const SidebarFooter: React.FunctionComponent<SidebarFooterProps> = (props: SidebarFooterProps) => {
  return (
    <div className="sidebar-footer background-secondary-alt">
      <Username user={props.user} />
    </div>
  );
}
 
export default SidebarFooter;
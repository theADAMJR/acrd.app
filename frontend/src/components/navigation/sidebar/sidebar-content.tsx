import SidebarFooter from './sidebar-footer';
import { useDispatch } from 'react-redux';
import { actions as ui } from '../../../store/ui';
import GuildDropdown from '../../dropdowns/guild-dropdown';
import ChannelTabs from './channel-tabs';

const SidebarContent: React.FunctionComponent = () => {  
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col bg-bg-secondary w-60">
      <div
        id="sidebarHeader"
        className="items-center shadow-elevation cursor-pointer h-12 pl-2.5 pr-4"
        onClick={() => dispatch(ui.toggleDropdown(GuildDropdown))}>
        <GuildDropdown />
      </div>
      <nav className="sidebar-tabs flex-grow px-2 pt-4">
        <ChannelTabs />
      </nav>
      <SidebarFooter />
    </div>
  );
}
 
export default SidebarContent;
import { useStore } from 'react-redux';
import AppNavbar from '../navigation/app-navbar';
import Guild from '../guild/guild';
import Sidebar from '../navigation/sidebar/sidebar';

const GuildPage: React.FunctionComponent = () => {  
  const state = useStore().getState();
  
  return (
    <>
      <Sidebar />
      <div className="content background-primary">
        <AppNavbar />
        {state.ui.activeGuild && <Guild />}
      </div>
    </>
  );
}
 
export default GuildPage;
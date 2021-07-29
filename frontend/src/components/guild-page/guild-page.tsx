import AppNavbar from '../app-navbar/app-navbar';
import Guild from '../guild/guild';
import Sidebar from '../sidebar/sidebar';

const GuildPage: React.FunctionComponent = () => {  
  return (
    <>
      <Sidebar />
      <div className="content background-primary">
        <AppNavbar />
        {state.activeGuild && <Guild />}
      </div>
    </>
  );
}
 
export default GuildPage;
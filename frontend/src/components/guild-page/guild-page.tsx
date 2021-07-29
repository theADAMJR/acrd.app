import store from '../../store/store';
import AppNavbar from '../app-navbar/app-navbar';
import Guild from '../guild/guild';
import Sidebar from '../sidebar/sidebar';

const GuildPage: React.FunctionComponent = () => {
  const state = store.getState();
  
  // TODO: replace w/ middleware
  return (state.selfUser) ? (
    <>
      <Sidebar user={state.selfUser} />
      <div className="content background-primary">
        <AppNavbar guild={state.activeGuild} channel={state.activeChannel} />
        {state.activeGuild && <Guild guild={state.activeGuild} />}
      </div>
    </>
  ) : <h1>Not logged in.</h1>;
}
 
export default GuildPage;
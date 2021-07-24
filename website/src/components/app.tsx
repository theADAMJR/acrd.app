import AppNavbar from './app-navbar';
import Guild from './guild';
import Sidebar from './sidebar';
import './app.scoped.css';
import store from '../redux/store';

export default function App() {
  const state = store.getState();

  return (
    <>
      <Sidebar />
      <div className="content background-primary">
        <AppNavbar guild={state.activeGuild} channel={state.activeChannel} />
        <Guild guild={state.activeGuild} />
      </div>
    </>
  );
}

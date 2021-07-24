import AppNavbar from '../app-navbar';
import Guild from '../guild/guild';
import Sidebar from '../sidebar';
import './app.scoped.css';
import store from '../../redux/store';
import { useEffect } from 'react';
import { readyUp } from '../../redux/actions/self-user-actions';

export default function App() {
  const { activeGuild, activeChannel, selfUser } = store.getState();

  useEffect(() => {
    if (selfUser) return;

    readyUp();
  });

  return (selfUser) ? (
    <>
      <Sidebar user={selfUser} />
      <div className="content background-primary">
        <AppNavbar guild={activeGuild} channel={activeChannel} />
        {activeGuild && <Guild guild={activeGuild} />}
      </div>
    </>
  ) : <h1>Not logged in.</h1>;
}

import AppNavbar from '../app-navbar/app-navbar';
import Guild from '../guild/guild';
import Sidebar from '../sidebar/sidebar';
import store from '../../redux/store';
import { useEffect } from 'react';
import { readyUp } from '../../redux/actions/self-user-actions';
import './app.scoped.css';
import { emit, on } from '../../redux/api-client';

export default function App() {
  const { activeGuild, activeChannel, selfUser } = store.getState();

  useEffect(() => {
    // if (selfUser) return;

    // readyUp();
    on('READY', (a) => console.log(a))
    emit('READY', {});
    alert('ready')
  });

  return (selfUser) ? (
    <>
      <Sidebar user={selfUser} />
      <div className="content background-primary">
        <AppNavbar guild={activeGuild} channel={activeChannel} />
        {activeGuild && <Guild guild={activeGuild} />}
      </div>
    </>
  ) : <h1 className="text-black">Not logged in.</h1>;
}

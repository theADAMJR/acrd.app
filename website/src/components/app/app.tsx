import AppNavbar from '../app-navbar/app-navbar';
import Guild from '../guild/guild';
import Sidebar from '../sidebar/sidebar';
import store from '../../redux/store';
import { useEffect } from 'react';
import { readyUp } from '../../redux/actions/self-user-actions';
import './app.scoped.css';
import { emit, on } from '../../redux/api-client';

export default function App() {
  let state = store.getState();

  store.subscribe(() => {
    state = store.getState();
    console.log(state);
  });

  useEffect(() => {
    if (state.selfUser) return;

    emit('READY', {})
    on('READY', (args) => {
      store.dispatch({ type: 'READY', payload: args });
    });
  });

  return (state.selfUser) ? (
    <>
      <Sidebar user={state.selfUser} />
      <div className="content background-primary">
        <AppNavbar guild={state.activeGuild} channel={state.activeChannel} />
        {state.activeGuild && <Guild guild={state.activeGuild} />}
      </div>
    </>
  ) : <h1 className="text-black">Not logged in.</h1>;
}

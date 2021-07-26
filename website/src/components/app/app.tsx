import AppNavbar from '../app-navbar/app-navbar';
import Guild from '../guild/guild';
import Sidebar from '../sidebar/sidebar';
import store from '../../redux/store';
import { useEffect } from 'react';
import { readyUp } from '../../redux/actions/self-user-actions';
import './app.scoped.css';
import { emit, on } from '../../redux/api-client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from '../home-page/home-page';
import GuildPage from '../guild-page/guild-page';

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

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        {/* <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />

        <Route path="/channels/@me/settings" component={UserSettingsPage} />
        <Route path="/channels/:guildId/settings" component={GuildSettingsPage} /> */}
        <Route path="/channels/:guildId/:channelId?" component={GuildPage} />
      </Switch>
    </Router>
  );
}

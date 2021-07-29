import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/home-page';
import GuildPage from '../pages/guild-page';
import './app.scoped.css';
import { Provider } from 'react-redux';
import configureStore from '../../store/configure-store';
import LoginPage from '../pages/login-page';
import RegisterPage from '../pages/register-page';

export default function App() {
  return (
    <Provider store={configureStore()}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />

          {/* <Route path="/channels/@me/settings" component={UserSettingsPage} />
          <Route path="/channels/:guildId/settings" component={GuildSettingsPage} /> */}
          <Route path="/channels/@me" component={OverviewPage} />
          <Route path="/channels/:guildId/:channelId?" component={GuildPage} />
        </Switch>
      </Router>
    </Provider>
  );
}

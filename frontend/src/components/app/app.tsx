import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/home-page';
import GuildPage from '../pages/guild-page';
import './app.scoped.css';
import { useDispatch } from 'react-redux';
import LoginPage from '../pages/login-page';
import RegisterPage from '../pages/register-page';
import OverviewPage from '../pages/overview-page';
import { ready } from '../../store/auth';
import { useEffect } from 'react';
import LogoutPage from '../pages/logout-page';
import environment from '../../environment';

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ready());
  }, []);
  
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/logout" component={LogoutPage} />

        <Route
          path="/assets"
          render={() => {
            const loc = window.location;
            const redirectTo = loc.pathname.replace('/assets/', '');
            return loc.href = `${environment.cdnURL}/${redirectTo}`;
          }} />

        {/* <Route path="/channels/@me/settings" component={UserSettingsPage} />
        <Route path="/channels/:guildId/settings" component={GuildSettingsPage} /> */}
        <Route path="/channels/@me" component={OverviewPage} />
        <Route path="/channels/:guildId/:channelId?" component={GuildPage} />
      </Switch>
    </Router>
  );
}

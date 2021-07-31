import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/home-page';
import GuildPage from '../pages/guild-page';
import './app.scoped.css';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from '../pages/login-page';
import RegisterPage from '../pages/register-page';
import OverviewPage from '../pages/overview-page';
import { ready } from '../../store/auth';
import { useEffect } from 'react';
import LogoutPage from '../pages/logout-page';
import { fetchMyGuilds } from '../../store/guilds';
import { fetchUsers } from '../../store/users';

export default function App() {
  const user = useSelector((s: Store.AppStore) => s.auth.user);
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ready());
    dispatch(fetchMyGuilds());
    dispatch(fetchUsers());
  }, []);
  
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/logout" component={LogoutPage} />

        {/* FIXME: blocks 404 page */}
        {(user)
          ? <div className="app">
              <Router>
                <Switch>
                  {/* <Route exact path="/channels/@me/settings" component={UserSettingsPage} />
                  <Route exact path="/channels/:guildId/settings" component={GuildSettingsPage} /> */}
                  <Route exact path="/channels/@me" component={OverviewPage} />
                  <Route exact path="/channels/:guildId/:channelId?" component={GuildPage} />
                </Switch>
              </Router>
            </div>
          : <Redirect to="/login" />}
        
        <Route path="*">
          <h1>404</h1>
        </Route>
      </Switch>
    </Router>
  );
}

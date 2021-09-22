import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/home-page';
import GuildPage from './pages/guild-page';
import LoginPage from './pages/auth/login-page';
import RegisterPage from './pages/auth/register-page';
import OverviewPage from './pages/overview-page';
import LogoutPage from './pages/auth/logout-page';
import PrivateRoute from './routing/private-route';
import NotFoundPage from './pages/not-found-page';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import fetchEntities from '../store/actions/fetch-entities';
import { ready } from '../store/auth';
import { initPings } from '../store/pings';
import VerifyPage from './pages/auth/verify-page';

export default function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(ready());
    dispatch(fetchEntities());
    dispatch(initPings());
  }, []);
  
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={HomePage} />
        <Route exact path={`${process.env.PUBLIC_URL}/login`} component={LoginPage} />
        <Route exact path={`${process.env.PUBLIC_URL}/register`} component={RegisterPage} />
        <Route exact path={`${process.env.PUBLIC_URL}/logout`} component={LogoutPage} />
        <Route exact path={`${process.env.PUBLIC_URL}/verify`} component={VerifyPage} />

        <PrivateRoute exact path={`${process.env.PUBLIC_URL}/channels/@me`} component={OverviewPage} />
        <PrivateRoute exact path={`${process.env.PUBLIC_URL}/channels/:guildId/:channelId?`} component={GuildPage} />

        <Route path={`${process.env.PUBLIC_URL}/*`} component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/home-page';
import GuildPage from './pages/guild-page';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import OverviewPage from './pages/overview-page';
import LogoutPage from './pages/logout-page';
import PrivateRoute from './routing/private-route';
import NotFoundPage from './pages/not-found-page';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/logout" component={LogoutPage} />

        <PrivateRoute exact path="/channels/@me" component={OverviewPage} />
        <PrivateRoute exact path="/channels/:guildId/:channelId?" component={GuildPage} />
        
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

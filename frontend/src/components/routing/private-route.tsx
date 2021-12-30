import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { applyTheme } from '../../store/themes';
import LoadingPage from '../pages/loading-page';

// this route ensures that the user is logged in, else redirects them 
const PrivateRoute: React.FunctionComponent<RouteProps> = (props) => {
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const fetchedEntities = useSelector((s: Store.AppState) => s.meta.fetchedEntities);
  const attemptedLogin = useSelector((s: Store.AppState) => s.auth.attemptedLogin);
  const themes = useSelector((s: Store.AppState) => s.entities.themes);
  const location = useLocation();

  if (attemptedLogin && !user)
    return <Redirect to={`/login?redirect=${location.pathname}`} />;
  else if (!user || !fetchedEntities)
    return <LoadingPage />;

  const theme = themes.find(t => t.id === user.activeThemeId)
    ?? themes.find(t => t.id === 'default');
  applyTheme(theme.styles);
  
  return (
    <Route {...props} />
  );
}
 
export default PrivateRoute;
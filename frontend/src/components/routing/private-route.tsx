import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { applyTheme } from '../../store/themes';
import LoadingPage from '../pages/loading-page';

// this route ensures that the user is logged in, else redirects them 
const PrivateRoute: React.FunctionComponent<RouteProps> = (props) => {
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const fetchedEntities = useSelector((s: Store.AppState) => s.meta.fetchedEntities);
  const attemptedLogin = useSelector((s: Store.AppState) => s.auth.attemptedLogin);
  const themes = useSelector((s: Store.AppState) => s.entities.themes);

  if (attemptedLogin && !user)
    return <Redirect to="/login" />;
  else if (!user || !fetchedEntities)
    return <LoadingPage />;

  const theme = themes.find(t => t.id === user.activeThemeId);
  applyTheme(theme.styles);
  
  return (
    <Route {...props} />
  );
}
 
export default PrivateRoute;
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import LoadingPage from '../pages/loading-page';

// this route ensures that the user is logged in, else redirects them 
const PrivateRoute: React.FunctionComponent<RouteProps> = (props) => {
  const user = useSelector((s: Store.AppStore) => s.entities);
  const { guilds, users } = useSelector((s: Store.AppStore) => s.entities);
  const attemptedLogin = useSelector((s: Store.AppStore) => s.auth.attemptedLogin);

  if (attemptedLogin && !user)
    return <Redirect to="/login" />;
  else if (!users.fetched || !guilds.fetched)
    return <LoadingPage />;
  
  return (
    <Route {...props} />
  );
}
 
export default PrivateRoute;
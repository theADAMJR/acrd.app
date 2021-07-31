import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import LoadingPage from './pages/loading-page';
import WSListener from './ws-listener';

export interface PrivateRouteProps {
  
}
 
const PrivateRoute: React.FunctionComponent<RouteProps> = (props) => {
  const user = useSelector((s: Store.AppStore) => s.auth.user);
  const attemptedLogin = useSelector((s: Store.AppStore) => s.auth.attemptedLogin);

  if (attemptedLogin && !user)
    return <Redirect to="/login" />;
  else if (!user)
    return <LoadingPage />;
  
  return (
    <Route {...props}>
      <WSListener />
    </Route>
  );
}
 
export default PrivateRoute;
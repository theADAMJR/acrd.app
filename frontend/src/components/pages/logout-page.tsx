import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout } from '../../store/auth';

const LogoutPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  dispatch(logout());
  
  return <Redirect to="/" push />;
}
 
export default LogoutPage;
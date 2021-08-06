import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logoutUser } from '../../store/auth';

const LogoutPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  dispatch(logoutUser());
  
  return <Redirect to="/" push />;
}
 
export default LogoutPage;
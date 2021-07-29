import { useDispatch, useSelector } from 'react-redux';
import { ready } from '../../store/auth';
import AppNavbar from '../navigation/app-navbar';

const OverviewPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user);

  dispatch(ready());

  return (
    <>
      <AppNavbar />
      {/* <Sidebar /> */}
      <h1>Welcome to the dashboard!</h1>
      {!user && <strong>No user :(</strong>}
      {user && <strong>{JSON.stringify(user)}</strong>}
    </>
  );
}
 
export default OverviewPage;
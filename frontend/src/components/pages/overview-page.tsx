import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pageSwitched } from '../../store/ui';
import AppNavbar from '../navigation/app-navbar';
import Sidebar from '../navigation/sidebar/sidebar';
import LoadingPage from './loading-page';

const OverviewPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user);

  useEffect(() => {
    dispatch(pageSwitched({ channel: null, guild: null }));
  }, []);

  return (user) ? (
    <div className="bg-bg-primary h-full w-full">
      <Sidebar />
      <AppNavbar />
      <div className="bg-bg-primary h-full w-full flex flex-col flex-grow">
      </div>
    </div>
  ) : <LoadingPage />;
}
 
export default OverviewPage;
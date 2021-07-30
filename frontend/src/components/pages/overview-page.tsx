import { useSelector } from 'react-redux';
import AppNavbar from '../navigation/app-navbar';
import Sidebar from '../navigation/sidebar/sidebar';
import LoadingPage from './loading-page';

const OverviewPage: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppStore) => s.auth.user);

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
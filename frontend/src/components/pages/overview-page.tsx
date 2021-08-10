import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { pageSwitched } from '../../store/ui';
import AppNavbar from '../navigation/app-navbar';
import Sidebar from '../navigation/sidebar/sidebar';
import PageWrapper from './page-wrapper';

const OverviewPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageSwitched({ channel: null, guild: null }));
  }, []);

  return (
    <PageWrapper
      className="bg-bg-primary h-full w-full"
      pageTitle="DClone">
      <Sidebar />
      <AppNavbar />
      <div className="bg-bg-primary h-full w-full flex flex-col flex-grow"></div>
    </PageWrapper>
  );
}
 
export default OverviewPage;
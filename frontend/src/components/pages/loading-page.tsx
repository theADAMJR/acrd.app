import { useEffect } from 'react';
import PageWrapper from './page-wrapper';
import { ready } from '../../store/auth';
import { useDispatch } from 'react-redux';
import { fetchMyGuilds } from '../../store/guilds';
import { fetchUsers } from '../../store/users';

const LoadingPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(ready());
    dispatch(fetchMyGuilds());
    dispatch(fetchUsers());
  }, []);

  const tips = [
    'This app took 2 weeks longer than expected to make.',
    'Stealing Discord since 1966.',
    'Disclaimer: Not actually a Discord clone.',
  ];
  const randomIndex = Math.floor(Math.random() * tips.length);

  return (
    <PageWrapper
      pageTitle="Loading..."
      className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl">Loading...</h1>
        <p className="lead block">{tips[randomIndex]}</p>
      </div>
    </PageWrapper>
  );
}
 
export default LoadingPage;

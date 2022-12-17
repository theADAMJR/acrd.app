import { useEffect } from 'react';
import PageWrapper from './page-wrapper';
import { ready } from '../../store/auth';
import { useDispatch } from 'react-redux';
import fetchEntities from '../../store/actions/fetch-entities';

const LoadingPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ready());
    dispatch(fetchEntities());
  }, []);

  const tips = [
    'Sample Text.',
    'May work on a Tesla',
    'Please subscribe.',
    'Hi YouTube!',
    'Like Discord, but less cringe.',
    'This message is officially dumb.',
    'This message is funny.',
    'Is coding the same as programming? 🤔',
    'TypeError: There may be bugs.',
    'What is a Discord? :thinking:',
    'Does anyone remember Skype?',
    'Started in 2020.',
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

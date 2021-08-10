import Particles from 'react-particles-js';
import { Link } from 'react-router-dom';
import CircleButton from '../utils/buttons/circle-button';
import PageWrapper from './page-wrapper';

const NotFoundPage: React.FunctionComponent = () => {
  return (
    <PageWrapper
      className="relative w-screen h-screen"
      pageTitle="DClone | Not Found">
      <header className="absolute text-center bottom-1/2 right-1/2">
        <h1 className="text-4xl pb-3">Not Found</h1>
        <Link to="/">
          <CircleButton>Return Home</CircleButton>
        </Link>
      </header>
      <Particles width="100%" height="100%" />
    </PageWrapper>
  );
}
 
export default NotFoundPage;
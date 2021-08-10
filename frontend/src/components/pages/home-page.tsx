import Particles from 'react-particles-js';
import { Link } from 'react-router-dom';
import Navbar from '../navigation/navbar';
import PageWrapper from './page-wrapper';

import './home-page.scoped.css';

const HomePage: React.FunctionComponent = () => {
  return (
    <PageWrapper
      className="bg-bg-tertiary h-full"
      pageTitle="DClone | Discord Clone With the Essentials">
      <Navbar />
      <section className="text-center my-4">
        <h1>It's time to ditch Skype and TeamSpeak.</h1>
        <div className="flex justify-center">
          <div className="lead font-light mt-2 max-w-xl">
            All-in-one voice and text chat for gamers that's free, secure, and works on both your desktop and phone. Stop paying for TeamSpeak servers and hassling with Skype. Simplify your life.
          </div>
        </div>
        <button className="font-primary shadow-md bg-green text-dark">
          <Link to="/login" >
            <button className="background bg-white text-black rounded w-56 h-11 px-6 mt-8">Login</button>
          </Link>
        </button>
        <button className="shadow-md bg-green text-dark ml-10">
          <Link to="/channels/@me">
            <button className="background bg-success heading rounded W-56 h-11 px-6 mt-8">Open DClone in Your Browser</button>
          </Link>
        </button>
      </section>
      <Particles width="100%" height="100%" />
    </PageWrapper>
  );
}
 
export default HomePage;
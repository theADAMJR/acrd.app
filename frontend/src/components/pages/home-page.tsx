import { Link } from 'react-router-dom';
import Navbar from '../navigation/navbar';
import PageWrapper from './page-wrapper';
import NormalButton from '../utils/buttons/normal-button';
import Chat from '../../assets/home/chat.svg';
import Devices from '../../assets/home/devices.svg';
import Friends from '../../assets/home/friends.svg';
import Secure from '../../assets/home/secure.svg';

import './home-page.scoped.css';

const HomePage: React.FunctionComponent = () => {
  const ImageCard = (props: { title: string, src: any }) => (
    <div>
      <h3 className="text-center text-1xl font-black font mb-4">{props.title}</h3>
      <img className="w-44 inline" src={props.src} alt="Chat" />
    </div>
  );

  let keys: string[] = [];
  document.addEventListener('keyup', (e) => {
    keys.push(e.key);
    if (!keys.join('').endsWith('testing123')) return;

    document.querySelector('h1')!.textContent = 'Easteregg++';
    document.querySelector('.lead')!.textContent = 'Are you happy now?';
  });

  return (
    <PageWrapper
      className="z-10 bg-bg-tertiary h-full relative"
      pageTitle="Accord | Discord Clone With the Essentials">
      <Navbar />
      <section className="z-10 text-center my-4">
        <h1>It's time to ditch Discord and Zoom.</h1>
        <div className="flex justify-center">
          <div className="lead font-light mt-2 max-w-xl">
            All-in-one voice and text chat for you that's free, secure, and works on both your desktop and phone. Stop paying for Discord server boosts and hassling with Zoom. Simplify your life.
          </div>
        </div>
        <button className="font-primary shadow-md bg-green text-dark">
          <Link to="/login" >
            <NormalButton className="bg-white text-black rounded w-56 h-11 px-6 mt-8">Login</NormalButton>
          </Link>
        </button>
        <button className="shadow-md bg-green text-dark ml-10">
          <Link to="/channels/@me">
            <NormalButton className="text-black bg-success rounded W-56 h-11 px-6 mt-8">Open Accord in Your Browser</NormalButton>
          </Link>
        </button>
      </section>

      <section className="absolute top-50 w-1/2 inset-x-1/4 flex justify-between">
        <ImageCard src={Chat} title="Chat w/ Friends" />
        <ImageCard src={Devices} title="On Mobile or Desktop" />
        <ImageCard src={Friends} title="Join or Manage Guilds" />
        <ImageCard src={Secure} title="Super Secure" />
      </section>
    </PageWrapper>
  );
}

export default HomePage;
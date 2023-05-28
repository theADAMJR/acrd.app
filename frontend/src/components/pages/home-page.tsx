import './home-page.scoped.css';

import { Link } from 'react-router-dom';
import Navbar from '../navigation/navbar';
import PageWrapper from './page-wrapper';
import NormalButton from '../utils/buttons/normal-button';
import Chat from '../../assets/home/chat.svg';
import Devices from '../../assets/home/devices.svg';
import Friends from '../../assets/home/friends.svg';
import Secure from '../../assets/home/secure.svg';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { countUsers } from '../../store/users';
import NumberFormat from 'react-number-format';

const HomePage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const userCount = useSelector((s: Store.AppState) => s.meta.userCount);

  useEffect(() => {
    dispatch(countUsers());
  }, []);

  const ImageCard = (props: { title: string, src: string, children?: any }) => (
    <div className='image-card'>
      <header className="text-center mb-2">
        <h3 className="text-white font-bold text-1xl">{props.title}</h3>
      </header>
      <img className="w-44 inline" src={props.src} alt="Chat" />
      <footer className='text-center mt-2'>
        <div className="secondary">{props.children}</div>
      </footer>
    </div>
  );

  const keys: string[] = [];
  document.addEventListener('keyup', (e) => {
    keys.push(e.key);
    if (!keys.join('').endsWith('testing123')) return;

    try {
      document.querySelector('h1')!.textContent = 'Easteregg++';
      document.querySelector('.lead')!.textContent = 'Are you happy now?';
    } catch { }
  });

  return (
    <PageWrapper
      className="z-10 bg-bg-tertiary h-full relative"
      pageTitle="acrd.app | Messaging Made Simple">
      <Navbar />
      <section className="z-10 text-center my-4">
        <h1>It's time to ditch Discord and Zoom.</h1>
        <div className="flex justify-center">
          <div className="lead font-light mt-2 max-w-xl">
            All-in-one easy-to-use text and voice chat.
            Stop paying for Discord boosts and hassling with Zoom.
            {Boolean(userCount) && (
              <span className="pl-1">
                Join <NumberFormat
                  value={userCount}
                  displayType={'text'}
                  thousandSeparator={true} /> Accord users that simplified their life.
              </span>
            )}
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

      <section
        title="*Description may represent unreleased features.*"
        className="absolute top-50 w-1/2 inset-x-1/4 flex justify-between">
        <ImageCard src={Chat} title="Chat Made Simple">
          Accord focuses on just the practical features for a simple messaging solution.
        </ImageCard>
        <ImageCard src={Devices} title="Mobile or Desktop">
          (work in progress)
        </ImageCard>
        <ImageCard src={Friends} title="Join and Manage Guilds">
          Create and customize your own messaging spaces for your friends.
        </ImageCard>
        <ImageCard src={Secure} title="Secure Messages">
          Accord is <a href={process.env.REACT_APP_REPO_URL} target="_blank">open-source on GitHub</a>.
          (work in progress)
        </ImageCard>
      </section>

      <footer className="fixed bottom-0 w-full">
        <a href={`${process.env.REACT_APP_REPO_URL}/blob/dev/CHANGELOG.md`}
          className="float-right p-2"
          target="none">
          <strong className="heading">{process.env.REACT_APP_VERSION_NAME}</strong>
          <span> </span>
          <span className="primary">{process.env.REACT_APP_VERSION_NUMBER}</span>
        </a>
      </footer>
    </PageWrapper>
  );
}

export default HomePage;
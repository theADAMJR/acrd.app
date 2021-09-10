import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import Username from '../user/username';
import NavTabs from '../utils/nav-tabs';
import Modal from './modal';

const UserProfile: FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.ui.activeUser);
  const [tab, setTab] = useState('info');

  const UserBadges = () => (user) ? (
    <div className="px-3 pt-2">
      {user.badges.map(b => <span className="pr-3">{b}</span>)}
    </div>
  ) : null;

  const UserInfo = () => (<div />);
  // guilds that self user and active user are both in
  const UserMutualGuilds = () => (
    <p>Mutual guilds will go here when ADAMJR adds it.</p>
  );

  
  return (user) ? (
    <Modal
      type={UserProfile}
      size="md">
      <header className="bg-bg-tertiary">
        <div className="p-5">
          <Username size="lg" user={user} />
          <UserBadges />
        </div>
        <hr className="border-bg-primary" />
        <NavTabs
          className="p-2"
          tab={tab}
          setTab={setTab}
          tabs={[
            { name: 'Info', id: 'info' },
            { name: 'Mutual Guilds', id: 'mutualGuilds' },
          ]} />
      </header>
      <main className="p-4">
        {(tab === 'info') && <UserInfo />}
        {(tab === 'mutualGuilds') && <UserMutualGuilds />}
      </main>
    </Modal>
  ) : null;
}
 
export default UserProfile;
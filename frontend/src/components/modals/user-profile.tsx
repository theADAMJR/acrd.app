import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import Username from '../user/username';
import NavTabs from '../utils/nav-tabs';
import Modal from './modal';

const UserProfile: FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.ui.activeUser);
  const [tab, setTab] = useState('info');

  const UserInfo = () => (
    <p>Info will go here when ADAMJR adds it.</p>
  );
  const UserMutualGuilds = () => (
    <p>Mutual guilds will go here when ADAMJR adds it.</p>
  );

  // guilds that self user and active user are both in
  
  return (user) ? (
    <Modal
      type={UserProfile}
      size="md">
      <header className="bg-bg-tertiary">
        <div className="p-5">
          <Username avatarSize="lg" user={user} />
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
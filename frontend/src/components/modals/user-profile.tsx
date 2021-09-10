import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import Username from '../user/username';
import NavTabs from '../utils/nav-tabs';
import Modal from './modal';

const UserProfile: FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.ui.activeUser);
  const [tab, setTab] = useState('info');
  
  return (user) ? (
    <Modal
      type={UserProfile}
      size="md">
      <header className="bg-bg-tertiary p-5">
        <Username avatarSize="lg" user={user} />
        <NavTabs
          tab={tab}
          setTab={setTab}
          tabs={[
            { name: 'Info', id: 'info' },
            { name: 'Mutual Guilds', id: 'mutualGuilds' },
          ]} />
      </header>
      <main>
        {(tab === 'info') && 'info'}
        {(tab === 'mutualGuilds') && 'mutual guilds'}
      </main>
    </Modal>
  ) : null;
}
 
export default UserProfile;
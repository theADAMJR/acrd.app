import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import Username from '../user/username';
import TabLink from '../utils/tab-link';
import Modal from './modal';

const UserProfile: FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.ui.activeUser);
  const [tab, setTab] = useState('info');  

  type Tab = { name: string, id: string };
  const tabs: Tab[] = [
    { name: 'Info', id: 'info' },
    { name: 'Mutual Guilds', id: 'mutualGuilds' },
  ];
  
  return (user) ? (
    <Modal
      type={UserProfile}
      size="md">
      <header className="bg-bg-tertiary p-5">
        <Username avatarSize="lg" user={user} />
        {tabs.map(t => (
          <TabLink
            tab={tab}
            setTab={setTab}
            id={t.id}
            key={t.id}>{t.name}</TabLink>
        ))}
      </header>
      <main>
        {(tab === 'info') && 'info'}
        {(tab === 'mutualGuilds') && 'mutual guilds'}
      </main>
    </Modal>
  ) : null;
}
 
export default UserProfile;
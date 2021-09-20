import { faBug, faGavel, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import Username from '../user/username';
import NavTabs from '../utils/nav-tabs';
import Modal from './modal';

const UserProfile: FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.ui.activeUser);
  const [tab, setTab] = useState('info');

  type BadgeIcon = {
    [k in UserTypes.Badge]: { color: string, icon: any, title: string }
  };
  const badgeIcons: BadgeIcon = {
    'BUG_1': {
      color: 'bronze',
      icon: faBug,
      title: 'Has destroyed a few bugs.',
    },
    'BUG_2': {
      color: 'silver',
      icon: faBug,
      title: 'Has destroyed many bugs.',
    },
    'BUG_3': {
      color: 'gold',
      icon: faBug,
      title: 'Are there still bugs left?'
    },
    'OG': {
      color: 'orange',
      icon: faSun,
      title: 'Was here since the very beginning',
    },
    'STAFF': {
      color: 'var(--primary)',
      icon: faGavel,
      title: 'Epic',
    },
  };

  const UserBadges = () => (user) ? (
    <div className="px-3 pt-2">
      {user.badges.map(b => {
        const { color, icon, title } = badgeIcons[b];
        return (
          <FontAwesomeIcon
            title={title}
            className="pr-3"
            style={{ color }}
            size="2x"
            icon={icon} />
        );
      })}
    </div>
  ) : null;

  const UserInfo = () => (<div />);
  // guilds that self user and active user are both in
  const UserMutualGuilds = () => (
    <p>Mutual guilds will go here when ADAMJR adds it.</p>
  );

  
  return (user) ? (
    <Modal
      typeName={'UserProfile'}
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
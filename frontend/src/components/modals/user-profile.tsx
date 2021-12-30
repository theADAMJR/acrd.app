import { UserTypes } from '@accord/types';
import { faBug, faGavel, faRocket, faSun, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import moment from 'moment';
import { FunctionComponent, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { getGuild } from '../../store/guilds';
import SidebarIcon from '../navigation/sidebar/sidebar-icon';
import Username from '../user/username';
import Category from '../utils/category';
import NavTabs from '../utils/nav-tabs';
import Modal from './modal';

const UserProfile: FunctionComponent = () => {
  const selfUser = useSelector((s: Store.AppState) => s.auth.user)!;
  const user = useSelector((s: Store.AppState) => s.ui.activeUser);
  const [tab, setTab] = useState('info');

  type BadgeIcon = {
    [k in UserTypes.Badge]: {
      color: string,
      icon: any,
      title: string,
      styles?: React.CSSProperties,
    };
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
      title: 'Are there any bugs left?'
    },
    'PREMIUM': {
      color: 'var(--heading)',
      icon: faRocket,
      title: 'This user has transcended the realm of epicness.',
    },
    'OG': {
      color: 'orange',
      icon: faSun,
      title: 'Was here since the very beginning.',
    },
    'STAFF': {
      color: 'var(--primary)',
      icon: faGavel,
      title: 'Staff.',
    },
    'VIEWER': {
      color: 'var(--tertiary)',
      icon: faVideo,
      title: 'This user was noticed in live chat.',
    },
  };

  const UserBadges = () => (user) ? (
    <div className="float-right -mt-16">
      {user.badges.map((b, i) => {
        const { color, icon, title, styles } = badgeIcons[b];
        return (
          <FontAwesomeIcon
            key={i}
            title={title}
            className={classNames('pr-3')}
            style={{ ...styles, color }}
            size="2x"
            icon={icon} />
        );
      })}
    </div>
  ) : null;

  const UserInfo = () => (user) ? (
    <div className="grid grid-cols-2">
      <div className="col-span-1">
        <strong className="primary">Created</strong>
        <span className="primary">: </span>
        <span>{moment(user.createdAt).format('MMMM Do YYYY, LT')}</span>
      </div>
    </div>
  ) : null;

  const UserMutualGuilds = () => {
    const store = useStore();

    if (!user) return null;
    
    const mutualGuilds = selfUser.guildIds
      .filter(id => user.guildIds.includes(id))
      .map(id => getGuild(id)(store.getState()));
    
    return (
      <div>
        <Category
          title={`${mutualGuilds.length} Mutual Guilds`}
          className="mb-2" />
        <div className="mx-2">
          {mutualGuilds.map(guild => (guild)
            ? <div
                className="w-12 -ml-2 float-left scale-200"
                key={guild.id}>
                <SidebarIcon
                  childClasses="bg-bg-tertiary"
                  imageURL={guild.iconURL}
                  name={guild.name}
                  disableHoverEffect />
              </div>
            : null
          )}
        </div>
      </div>
    );
  }

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
          className="normal p-2"
          tab={tab}
          setTab={setTab}
          tabs={[
            { name: 'Info', id: 'info' },
            { name: 'Mutual Guilds', id: 'mutualGuilds' },
          ]}
          linkStyle={{
            color: 'var(--normal)',
            fontWeight: 'bold',
            padding: '0 0 30px 0',
            margin: '5px 10px',
            borderRadius: 0,
            display: 'inline-block',
          }}
          activeLinkStyle={{ borderBottom: '3px solid var(--normal)' }} />
      </header>
      <main className="p-4">
        {(tab === 'info') && <UserInfo />}
        {(tab === 'mutualGuilds') && <UserMutualGuilds />}
      </main>
    </Modal>
  ) : null;
}
 
export default UserProfile;
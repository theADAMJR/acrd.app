import { useSelector } from 'react-redux';
import Category from '../../utils/category';
import Modal from '../modal';
import { useState } from 'react';
import ChannelSettingsOverview from './channel-settings-overview';
import ChannelSettingsPerms from './channel-settings-perms';
import EscButton from '../../utils/buttons/esc-button';
import usePerms from '../../../hooks/use-perms';
import NavTabs from '../../utils/nav-tabs';

const ChannelSettings: React.FunctionComponent = () => {
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const [tab, setTab] = useState('overview');
  const perms = usePerms();

  const tabs = [{ perm: 'MANAGE_CHANNELS', name: 'Overview', id: 'overview' }];
  if (channel?.type !== 'VOICE')
    tabs.push({ perm: 'MANAGE_CHANNELS', name: 'Perms', id: 'perms' });

  return (channel) ? (
    <Modal typeName={'ChannelSettings'} size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 bg-bg-secondary">
          <nav className="float-right flex-grow py-14 w-48 my-1 mr-4">
            <Category
              className="muted px-2.5 pb-1.5"
              title={`#${channel.name}`} />
          <NavTabs
            tabs={tabs}
            tab={tab}
            setTab={setTab}
            predicate={t => perms.can(t.perm as any, guild.id)} />
          </nav>
        </div>

        <div className="col-span-6 h-full">
          {tab === 'overview' && <ChannelSettingsOverview />}
          {tab === 'perms' && <ChannelSettingsPerms />}
        </div>

        <div className="col-span-2 h-full">
          <EscButton />
        </div>
      </div>
    </Modal>
  ) : null;
};
 
export default ChannelSettings;
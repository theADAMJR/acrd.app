import { useSelector } from 'react-redux';
import Category from '../../utils/category';
import Modal from '../modal';
import { useState } from 'react';
import GuildSettingsOverview from './guild-settings-overview';
import GuildSettingsRoles from './guild-settings-roles';
import EscButton from '../../utils/buttons/esc-button';
import usePerms from '../../../hooks/use-perms';
import GuildSettingsInvites from './guild-settings-invites';
import NavTabs from '../../utils/nav-tabs';

const GuildSettings: React.FunctionComponent = () => {
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const [tab, setTab] = useState('overview');
  const perms = usePerms();

  return (guild) ? (
    <Modal typeName={'GuildSettings'} size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 bg-bg-secondary">
          <nav className="float-right flex-grow py-14 w-48 my-1 mr-4">
            <Category
              className="muted px-2.5 pb-1.5"
              title={guild.name} />
          <NavTabs
            tabs={[
              { perm: 'MANAGE_GUILD', name: 'Overview', id: 'overview' },
              { perm: 'MANAGE_ROLES', name: 'Roles', id: 'roles' },
              { perm: 'MANAGE_INVITES', name: 'Invites', id: 'invites' },
            ]}
            tab={tab}
            setTab={setTab}
            predicate={t => perms.can(t.perm as any, guild.id)} />
          </nav>
        </div>

        <div className="col-span-6 h-full">
          {tab === 'overview' && <GuildSettingsOverview />}
          {tab === 'roles' && <GuildSettingsRoles />}
          {tab === 'invites' && <GuildSettingsInvites />}
        </div>

        <div className="col-span-2 h-full">
          <EscButton />
        </div>
      </div>
    </Modal>
  ) : null;
};
 
export default GuildSettings;
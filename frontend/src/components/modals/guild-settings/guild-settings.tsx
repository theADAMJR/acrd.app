import { useDispatch, useSelector } from 'react-redux';
import { updateGuild } from '../../../store/guilds';
import Category from '../../utils/category';
import Modal from '../modal';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import GuildSettingsOverview from './guild-settings-overview';
import GuildSettingsRoles from './guild-settings-roles';

const GuildSettings: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const [tab, setTab] = useState('overview');

  const TabLink = ({ name }) => (
    <Link
      to="#"
      onClick={() => /*!saveChangesOpen &&*/ setTab(name.toLowerCase())}
      className={`
        flex items-center rounded py-1.5 px-2.5 h-8 mb-0.5
        ${tab === name.toLowerCase() && 'active'}`}>{name}</Link>
  );
  
  return (guild) ? (
    <Modal type={GuildSettings} size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 bg-bg-secondary">
          <nav className="float-right flex-grow py-14 w-48 my-1 mr-4">
            <Category
              className="muted px-2.5 pb-1.5"
              title={guild.name} />
            <TabLink name="Overview" />
            <TabLink name="Roles" />
          </nav>
        </div>

        <div className="col-span-8 h-full">
          {tab === 'overview' && <GuildSettingsOverview />}
          {tab === 'roles' && <GuildSettingsRoles />}
        </div>
      </div>
    </Modal>
  ) : null;
};
 
export default GuildSettings;
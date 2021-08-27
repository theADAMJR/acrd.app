import { useDispatch, useSelector } from 'react-redux';
import Category from '../../utils/category';
import Modal from '../modal';
import { useState } from 'react';
import GuildSettingsOverview from './guild-settings-overview';
import GuildSettingsRoles from './guild-settings-roles';
import TabLink from '../../utils/tab-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { actions as ui } from '../../../store/ui';

const GuildSettings: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const [tab, setTab] = useState('overview');
  
  return (guild) ? (
    <Modal type={GuildSettings} size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 bg-bg-secondary">
          <nav className="float-right flex-grow py-14 w-48 my-1 mr-4">
            <Category
              className="muted px-2.5 pb-1.5"
              title={guild.name} />
            <TabLink
              tab={tab}
              setTab={setTab}
              id="overview">Overview</TabLink>
            <TabLink
              tab={tab}
              setTab={setTab}
              id="roles">Roles</TabLink>
          </nav>
        </div>

        <div className="col-span-6 h-full">
          {tab === 'overview' && <GuildSettingsOverview />}
          {tab === 'roles' && <GuildSettingsRoles />}
        </div>

        <div className="col-span-2 h-full">
          <div
            className="cursor-pointer border-white rounded-full p-8 w-10"
            onClick={() => dispatch(ui.closedModal())}>
            <FontAwesomeIcon icon={faTimes} />
            <span className="text-center block muted">ESC</span>
          </div>
        </div>
      </div>
    </Modal>
  ) : null;
};
 
export default GuildSettings;
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EscButton from '../../utils/buttons/esc-button';
import Category from '../../utils/category';
import TabLink from '../../utils/tab-link';
import Modal from '../modal';
import UserSettingsOverview from './user-settings-overview';

const UserSettings: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const [tab, setTab] = useState('overview');

  return (user) ? (
    <Modal
      type={UserSettings}
      size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 bg-bg-secondary">
          <nav className="float-right flex-grow py-14 w-48 my-1 mr-4">
            <Category
              className="normal px-2.5 pb-1.5"
              title="User Settings" />
            <TabLink
              id="overview"
              tab={tab}
              setTab={setTab}>Overview</TabLink>

            <div className="rounded-sm bg-bg-modifier-accent h-px w-42 my-2 mx-2.5 " />

            <Link
              to="/logout"
              className="danger flex items-center rounded py-1.5 px-2.5 h-8 mb-0.5">Logout</Link>
          </nav>
        </div>

        <div className="col-span-6 h-full">
          {tab === 'overview' && <UserSettingsOverview />}
        </div>

        <div className="col-span-2 h-full">
          <EscButton />
        </div>
      </div>
    </Modal>
  ) : null;
}

export default UserSettings;
import { faUserPlus, faPlusCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { openedModal } from '../../store/ui';
import CreateChannel from '../modals/create-channel';
import CreateInvite from '../modals/create-invite';
import GuildSettings from '../modals/guild-settings';
import Dropdown from '../utils/dropdown';

const GuildDropdown: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppStore) => s.ui.activeGuild);

  const openCreateChannel = () => dispatch(openedModal(CreateChannel));
  const openCreateInvite = () => dispatch(openedModal(CreateInvite));
  const openGuildSettings = () => dispatch(openedModal(GuildSettings));

  return (guild) ? (
    <Dropdown title={guild.name}>
      <a className="rounded-sm flex items-center justify-between p-2 h-8 text-sm mb-1"
        onClick={openCreateInvite}>
        <span className="primary">Invite people</span>
        <FontAwesomeIcon
          className="float-right w-1"
          icon={faUserPlus} />
      </a>

      <a className="rounded-sm flex items-center justify-between p-2 h-8 text-sm mb-1"
        onClick={openCreateChannel}>
        <span className="font">Create channel</span>
        <FontAwesomeIcon
          className="float-right w-1"
          icon={faPlusCircle} />
      </a>

      <a onClick={openGuildSettings}
        className="rounded-sm flex items-center justify-between p-2 h-8 text-sm">
        <span className="font">Server settings</span>
        <FontAwesomeIcon
          className="float-right w-1"
          icon={faCog} />
      </a>
    </Dropdown>
  ) : null;
}

export default GuildDropdown;
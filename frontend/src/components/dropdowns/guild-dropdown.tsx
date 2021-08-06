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

  return (guild) ? (
    <Dropdown
      title={guild.name}
      type={GuildDropdown}>
      <a className="rounded-sm flex items-center justify-between text-sm p-2 h-8 mb-1"
        onClick={() => dispatch(openedModal(CreateInvite))}>
        <span className="primary">Invite people</span>
        <FontAwesomeIcon
          className="float-right w-1"
          icon={faUserPlus} />
      </a>

      <a className="rounded-sm flex items-center justify-between p-2 h-8 text-sm mb-1"
        onClick={() => dispatch(openedModal(CreateChannel))}>
        <span className="font">Create channel</span>
        <FontAwesomeIcon
          className="float-right w-1"
          icon={faPlusCircle} />
      </a>

      <a onClick={() => dispatch(openedModal(GuildSettings))}
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
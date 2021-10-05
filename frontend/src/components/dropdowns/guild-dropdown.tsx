import { faUserPlus, faPlusCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../hooks/use-perms';
import { actions as ui } from '../../store/ui';
import CreateChannel from '../modals/create-channel';
import CreateInvite from '../modals/create-invite';
import GuildSettings from '../modals/guild-settings/guild-settings';
import Dropdown from '../utils/dropdown';

const GuildDropdown: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const perms = usePerms();

  if (!guild) return null;

  return (
    <Dropdown
      title={guild.name}
      type={GuildDropdown}>
      {perms.can('CREATE_INVITE', guild.id) && (
        <a className="rounded-sm flex items-center justify-between text-sm p-2 h-8 mb-1"
          onClick={() => dispatch(ui.openedModal('CreateInvite'))}>
          <span className="primary">Invite people</span>
          <FontAwesomeIcon
            className="float-right w-1"
            icon={faUserPlus} />
        </a>
      )}
      {perms.can('MANAGE_CHANNELS', guild.id) && (
        <a className="rounded-sm flex items-center justify-between p-2 h-8 text-sm mb-1"
          onClick={() => dispatch(ui.openedModal('CreateChannel'))}>
          <span className="font">Create channel</span>
          <FontAwesomeIcon
            className="float-right w-1"
            icon={faPlusCircle} />
        </a>
      )}
      {(perms.can('MANAGE_GUILD', guild.id)
        || perms.can('MANAGE_ROLES', guild.id)
        || perms.can('MANAGE_INVITES', guild.id)) && (
        <a onClick={() => dispatch(ui.openedModal('GuildSettings'))}
          className="rounded-sm flex items-center justify-between p-2 h-8 text-sm">
          <span className="font">Guild settings</span>
          <FontAwesomeIcon
            className="float-right w-1"
            icon={faCog} />
        </a>
      )}
    </Dropdown>
  );
}

export default GuildDropdown;
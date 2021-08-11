import Username from '../../user/username';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { openedModal } from '../../../store/ui';
import UserSettings from '../../modals/user-settings';
 
const SidebarFooter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user)!;
  
  return (
    <div className="select-all relative flex items-center bg-bg-secondary-alt py-2">
      <Username user={user} />
      <FontAwesomeIcon
        onClick={() => dispatch(openedModal(UserSettings))}
        className="float-right cursor-pointer absolute right-4"
        icon={faCog} />
    </div>
  );
}
 
export default SidebarFooter;
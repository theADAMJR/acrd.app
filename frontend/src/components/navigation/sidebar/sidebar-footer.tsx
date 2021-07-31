import Username from '../../user/username/username';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { openedModal } from '../../../store/ui';
import UserSettings from '../../modals/user-settings';
 
const SidebarFooter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user)!;
  
  return (
    <div
      style={{height: '52px'}}
      className="relative flex items-center sidebar-footer bg-bg-secondary-alt">
      <Username user={user} />
      <FontAwesomeIcon
        onClick={() => dispatch(openedModal({
          typeName: UserSettings.name,
        }))}
        className="float-right cursor-pointer absolute right-4"
        icon={faCog} />
    </div>
  );
}
 
export default SidebarFooter;
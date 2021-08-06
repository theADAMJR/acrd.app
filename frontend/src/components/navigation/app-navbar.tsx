import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMemberList } from '../../store/config';
 
const AppNavbar: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppStore) => s.ui.activeChannel);
  const guild = useSelector((s: Store.AppStore) => s.ui.activeGuild);
  const memberListToggled = useSelector((s: Store.AppStore) => s.config.memberListToggled);

  return (
    <div className="shadow-elevation flex items-center h-12 px-5">
      {channel && <FontAwesomeIcon
        icon={faHashtag}
        className="scale-150 mr-2" />}
      <h3 className="flex-grow font-bold ml-1">{channel?.name}</h3>
      {guild && (
        <FontAwesomeIcon
          onClick={() => dispatch(toggleMemberList())}
          icon={faUserFriends}
          className={`cursor-pointer ${memberListToggled ? 'heading' : 'muted'}`} />)}
    </div>
  );
}
 
export default AppNavbar;
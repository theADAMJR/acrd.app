import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMemberList } from '../../store/config';
import classNames from 'classnames';
 
const AppNavbar: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel);
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild);
  const memberListToggled = useSelector((s: Store.AppState) => s.config.memberListToggled);

  return (
    <div className="shadow-elevation flex items-center h-12 px-5">
      {channel && <FontAwesomeIcon
        icon={faHashtag}
        className="scale-150 mr-2" />}
      <h3 className="flex-grow ml-1">
        <span className="font-bold">{channel?.name}</span>
        <span className="muted ml-3">{channel?.summary}</span>
      </h3>
      {guild && (
        <FontAwesomeIcon
          onClick={() => dispatch(toggleMemberList())}
          icon={faUserFriends}
          className={classNames(`cursor-pointer`, {
            'heading': memberListToggled,
            'muted': !memberListToggled,
          })} />)}
    </div>
  );
}
 
export default AppNavbar;
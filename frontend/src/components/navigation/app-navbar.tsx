import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
 
const AppNavbar: React.FunctionComponent = () => {
  const channel = useSelector((s: Store.AppStore) => s.ui.activeChannel);

  return (
    <div className="shadow-elevation flex items-center h-12 px-5">
      {channel && <FontAwesomeIcon
        icon={faHashtag}
        className="scale-150 mr-2" />}
      <h3 className="font-bold ml-1">{channel?.name}</h3>
    </div>
  );
}
 
export default AppNavbar;
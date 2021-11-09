import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { PermissionTypes } from '../../../services/perm-service';
import { openSaveChanges } from '../../../store/ui';
import ThreeToggle from '../../utils/input/three-toggle';

interface PermToggleProps {
  permName: string;
  allowState: [number, React.Dispatch<React.SetStateAction<number>>];
  denyState: [number, React.Dispatch<React.SetStateAction<number>>];
}

const PermToggle: React.FunctionComponent<PermToggleProps> = ({ allowState, denyState, permName }) => {
  const { description } = usePerms();
  const category = useSelector((s: Store.AppState) => s.ui.activeChannel)!.type.toLowerCase();
  const dispatch = useDispatch();
  const [allow, setAllow] = allowState;
  const [deny, setDeny] = denyState;

  const isAllowed = (name: string) => Boolean(allow & PermissionTypes.All[name]);
  const isDenied = (name: string) => Boolean(deny & PermissionTypes.All[name]);
  
  const getDefaultValue = () => {
    if (isAllowed(permName)) return 'on';
    else if (isDenied(permName)) return 'off';
    return 'n/a';
  };
  
  const togglePerm = (name: string, state: string) => {   
    if (state === 'n/a') {
      setAllow(allow & ~PermissionTypes.All[name]);
      setDeny(deny & ~PermissionTypes.All[name]);
    } else if (state === 'on') {
      setAllow(allow | PermissionTypes.All[name]);
      setDeny(deny & ~PermissionTypes.All[name]);
    } else {
      setAllow(allow & ~PermissionTypes.All[name]);
      setDeny(deny | PermissionTypes.All[name]);
    }
    // dispatch(openSaveChanges(true));
  }  
  
  return (
    <div className="flex items-center justify-between mb-2">
      <span>{description[category][permName]}</span>
      <ThreeToggle
        id={permName}
        onChange={e => togglePerm(permName, e.currentTarget.value)}
        className="float-right"
        defaultValue={getDefaultValue()} />
    </div>
  );
}
export default PermToggle;
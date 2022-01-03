import { ChannelTypes } from '@accord/types';
import { PermissionTypes } from '@accord/types';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { openSaveChanges } from '../../../store/ui';
import ThreeToggle from '../../inputs/three-toggle';

interface PermToggleProps {
  permName: string;
  overrideState: [ChannelTypes.Override, React.Dispatch<React.SetStateAction<ChannelTypes.Override>>];
}

const PermToggle: React.FunctionComponent<PermToggleProps> = ({ overrideState, permName }) => {
  const { description } = usePerms();
  const category = useSelector((s: Store.AppState) => s.ui.activeChannel)!.type.toLowerCase();
  const dispatch = useDispatch();
  const [override, setOverride] = overrideState;

  const isAllowed = (name: string) => Boolean(override.allow & PermissionTypes.All[name]);
  const isDenied = (name: string) => Boolean(override.deny & PermissionTypes.All[name]);
  
  const getDefaultValue = () => {
    if (isAllowed(permName)) return 'on';
    else if (isDenied(permName)) return 'off';
    return 'n/a';
  };
  
  const togglePerm = (name: string, state: string) => {   
    if (state === 'off') {
      override.allow &= ~PermissionTypes.All[name];
      override.deny &= ~PermissionTypes.All[name];
    } else if (state === 'n/a') {
      override.allow |= PermissionTypes.All[name];
      override.deny &= ~PermissionTypes.All[name];
    } else if(state === 'on') {
      override.allow &= ~PermissionTypes.All[name];
      override.deny |= PermissionTypes.All[name];
    }
    setOverride(override);
    dispatch(openSaveChanges(true));
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
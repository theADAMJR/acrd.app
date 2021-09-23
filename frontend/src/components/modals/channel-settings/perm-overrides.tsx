import { UseFormSetValue, FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { PermissionTypes } from '../../../services/perm-service';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Toggle from '../../utils/input/toggle';

export interface PermOverrides {
  setOverrides: React.Dispatch<React.SetStateAction<ChannelTypes.Override[]>>;
  overrides: ChannelTypes.Override[];
  activeOverride: ChannelTypes.Override;
}
 
const PermOverrides: React.FunctionComponent<PermOverrides> = ({ setOverrides, overrides }) => {
  const dispatch = useDispatch();
  const { description } = usePerms();
  
  const fullySetOverrides = (overrides: number) => {
    setOverrides(overrides);
    dispatch(openSaveChanges(true));
  };
  const togglePerm = (name: string, on: boolean) => {
    fullySetOverrides((on)
      ? overrides | PermissionTypes.All[name]
      : overrides & ~PermissionTypes.All[name]);
  }
  const has = (name: string) => Boolean(overrides & PermissionTypes.All[name]);
  const PermToggle = ({ category, permName }) => (
    <div className="flex items-center justify-between mb-2">
      <span>{description[category][permName]}</span>
      <Toggle
        id={permName}
        checked={has(permName)}
        onChange={() => togglePerm(permName, !has(permName))}
        className="float-right" />
    </div>
  );

  return (
    <>
      {Object.keys(description).map(category => (
        <div key={category} className="mb-5">
          <Category className="muted pb-1.5 mt-5" title={category} />
            {Object.keys(description[category]).map(permName =>
              <PermToggle
                key={permName}
                category={category}
                permName={permName} />)}
        </div>
      ))}
      <NormalButton
        onClick={() => fullySetOverrides(0)}
        className="bg-white text-black"
        type="button">Clear</NormalButton>
    </>
  );
}
 
export default PermOverrides;
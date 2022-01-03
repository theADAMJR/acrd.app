import { UseFormSetValue, FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Toggle from '../../inputs/toggle';
import { PermissionTypes } from '@accord/types';

export interface RolePermissionsProps {
  setRoleValue: UseFormSetValue<FieldValues>;
  setPerms: React.Dispatch<React.SetStateAction<number>>;
  perms: number;
}
 
const RolePermissions: React.FunctionComponent<RolePermissionsProps> = ({ perms, setPerms, setRoleValue: setValue }) => {
  const dispatch = useDispatch();
  const { description } = usePerms();
  
  const fullySetPerms = (perms: number) => {
    setPerms(perms);
    setValue('permissions', perms);
    dispatch(openSaveChanges(true));
  };
  const togglePerm = (name: string, on: boolean) =>
    fullySetPerms((on)
      ? perms | PermissionTypes.All[name]
      : perms & ~PermissionTypes.All[name]);
  const has = (name: string) => Boolean(perms & PermissionTypes.All[name]);
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
            {Object.keys(description[category]).map(permName => (
              <>
                <strong
                  title={PermissionTypes.All[permName]}
                  className="secondary">{permName}</strong>
                <PermToggle
                  key={permName}
                  category={category}
                  permName={permName} />
              </>
            ))}
        </div>
      ))}
      <NormalButton
        onClick={() => fullySetPerms(0)}
        className="bg-white text-black"
        type="button">Clear</NormalButton>
      <NormalButton
        onClick={() => fullySetPerms(PermissionTypes.defaultPermissions)}
        className="bg-secondary text-black ml-2"
        type="button">Default</NormalButton>
    </>
  );
}
 
export default RolePermissions;
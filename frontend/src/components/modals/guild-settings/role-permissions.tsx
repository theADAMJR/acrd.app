import { UseFormSetValue, FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { permDescription, PermissionTypes } from '../../../services/perm-service';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Toggle from '../../utils/input/toggle';

export interface RolePermissionsProps {
  setValue: UseFormSetValue<FieldValues>;
  setPerms: React.Dispatch<React.SetStateAction<number>>;
  perms: number;
}
 
const RolePermissions: React.FunctionComponent<RolePermissionsProps> = ({ perms, setPerms, setValue }) => {
  const dispatch = useDispatch();
  
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
    <div key={permName} className="flex items-center justify-between mb-2">
      <span>{permDescription[category][permName]}</span>
      <Toggle
        id={permName}
        checked={has(permName)}
        onChange={() => togglePerm(permName, !has(permName))}
        className="float-right" />
    </div>
  );

  return (
    <>
      {Object.keys(permDescription).map(category => <>
        <Category
          key={category}
          className="muted px-2.5 pb-1.5 mt-5"
          title={category} />
        {Object.keys(permDescription[category]).map(permName =>
          <PermToggle category={category} permName={permName} />)}
      </>)}
      <NormalButton
        onClick={() => fullySetPerms(0)}
        className="bg-white text-black"
        type="button">Clear</NormalButton>
      <NormalButton
        onClick={() => fullySetPerms(PermissionTypes.defaultPermissions)}
        className="bg-secondary text-black ml-2"
        type="button">Default</NormalButton>
    </
  >);
}
 
export default RolePermissions;
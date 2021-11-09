import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { PermissionTypes } from '../../../services/perm-service';
import { openSaveChanges } from '../../../store/ui';
import ThreeToggle from '../../utils/input/three-toggle';

interface PermToggleProps {
  form: UseFormReturn<ChannelTypes.Override>;
  permName: string;
}

const PermToggle: React.FunctionComponent<PermToggleProps> = ({ form, permName }) => {
  const { description } = usePerms();
  const category = useSelector((s: Store.AppState) => s.ui.activeChannel)!.type.toLowerCase();
  const dispatch = useDispatch();

  const getAllow = (): number => form.getValues('allow');
  const getDeny = (): number => form.getValues('allow');
  const isAllowed = (name: string) => Boolean(getAllow() & PermissionTypes.All[name]);
  const isDenied = (name: string) => Boolean(getDeny() & PermissionTypes.All[name]);
  
  const getDefaultValue = () => {
    if (isAllowed(permName)) return 'on';
    else if (isDenied(permName)) return 'off';
    return 'n/a';
  };
  
  const togglePerm = (name: string, state: string) => {   
    console.log(name, state); 
    if (state === 'n/a') {
      form.setValue('allow', getAllow() & ~PermissionTypes.All[name]);
      form.setValue('deny', getDeny() & ~PermissionTypes.All[name]);
    } else if (state === 'on') {
      form.setValue('allow', getAllow() | PermissionTypes.All[name]);
      form.setValue('deny', getDeny() & ~PermissionTypes.All[name]);
    } else {
      form.setValue('allow', getAllow() & ~PermissionTypes.All[name]);
      form.setValue('deny', getDeny() | PermissionTypes.All[name]);
    }
    console.log(form.getValues());
    dispatch(openSaveChanges(true));
  }  
  
  return (
    <div className="flex items-center justify-between mb-2">
      <span>{description[category][permName]}</span>
      {useMemo(() => (
        <ThreeToggle
          id={permName}
          onChange={e => togglePerm(permName, e.currentTarget.value)}
          className="float-right"
          defaultValue={getDefaultValue()} />
      ), [permName])}
    </div>
  );
}
export default PermToggle;
import { useState } from 'react';
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
 
const PermOverrides: React.FunctionComponent<PermOverrides> = ({ setOverrides, overrides, activeOverride }) => {
  return <h1>Still in development...</h1>;
  
  const dispatch = useDispatch();
  const { description } = usePerms();
  const [allow, setAllow] = useState(activeOverride.allow);
  const [deny, setDeny] = useState(activeOverride.deny);
  
  const category = 'text';
  
  const togglePerm = (name: string, state: 'ALLOW' | 'INHERIT' | 'DENY') => {
    if (state === 'INHERIT') {
      // remove from both
      setAllow(allow & ~PermissionTypes.All[name]);
      setDeny(deny & ~PermissionTypes.All[name]);
    } else if (state === 'ALLOW')
      setAllow(allow | PermissionTypes.All[name]);
    else setDeny(deny | PermissionTypes.All[name]);
    updateOverrides();
  }
  const updateOverrides = () => {
    const roleId = activeOverride.roleId;
    const thisIndex = overrides.findIndex(o => o.roleId === roleId);
    overrides[thisIndex] = { allow, deny, roleId };

    setOverrides(overrides);
    dispatch(openSaveChanges(true));
  };

  const isAllowed = (name: string) => Boolean(allow & PermissionTypes.All[name]);
  const isInherited = (name: string) =>
    !Boolean(allow & PermissionTypes.All[name])
    && !Boolean(deny & PermissionTypes.All[name]);

  const PermToggle = ({ permName }) => (
    <div className="flex items-center justify-between mb-2">
      <span>{description[category][permName]}</span>
      <Toggle
        id={permName}
        checked={isAllowed(permName)}
        onChange={({ currentTarget: toggle }) => {
          if (toggle.indeterminate)
            togglePerm(permName, 'INHERIT');
          else if (toggle.checked)
            togglePerm(permName, 'ALLOW')
          else togglePerm(permName, 'DENY');
        }}
        className="float-right"
        allowIndeterminate
        indeterminate={isInherited(permName)} />
    </div>
  );

  const clearOverrides = () => {
    setAllow(0);
    setDeny(0);
    updateOverrides();
  };

  return (
    <>
      <div className="mb-5">
        <Category className="muted pb-1.5 mt-5" title={category} />
          {Object.keys(description[category]).map(permName =>
            <PermToggle
              key={permName}
              permName={permName} />)}
      </div>
      <NormalButton
        onClick={clearOverrides}
        className="bg-white text-black float-left"
        type="button">Clear</NormalButton>
    </>
  );
}
 
export default PermOverrides;
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { PermissionTypes } from '../../../services/perm-service';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import ThreeToggle from '../../utils/input/three-toggle';

export interface PermOverrides {
  setOverride: React.Dispatch<React.SetStateAction<ChannelTypes.Override | undefined>>;
  activeOverride: ChannelTypes.Override | undefined;
}
 
const PermOverrides: React.FunctionComponent<PermOverrides> = ({ setOverride, activeOverride }) => {
  const dispatch = useDispatch();
  const { description } = usePerms();
  const [allow, setAllow] = useState(activeOverride?.allow ?? 0);
  const [deny, setDeny] = useState(activeOverride?.deny ?? 0);
  
  if (!activeOverride) return null;
  
  const category = 'text';
  
  const togglePerm = (name: string, state: string) => {    
    // FIXME: initial state twice (off), then other states
    // console.log(state);
    
    if (state === 'indeterminate') {
      setAllow(allow & ~PermissionTypes.All[name]);
      setDeny(deny & ~PermissionTypes.All[name]);
    } else if (state === 'on') {
      setAllow(allow | PermissionTypes.All[name]);
      setDeny(deny & ~PermissionTypes.All[name]);
    } else {
      setAllow(allow & ~PermissionTypes.All[name]);
      setDeny(deny | PermissionTypes.All[name]);
    }
    // console.log('allow', allow);
    // console.log('deny', deny);
    
    updateOverrides();
  }
  const updateOverrides = () => {
    activeOverride.allow = allow;
    activeOverride.deny = deny;
    
    setOverride(activeOverride);
    // FIXME: this is rerendering the toggles, which messes up their state
    // dispatch(openSaveChanges(true));
  };

  const isAllowed = (name: string) => Boolean(allow & PermissionTypes.All[name]);
  const isDenied = (name: string) => Boolean(deny & PermissionTypes.All[name]);;

  const PermToggle = ({ permName }) => {
    const getValue = () => {
      if (isAllowed(permName)) return 'on';
      else if (isDenied(permName)) return 'off';
      return 'indeterminate';
    };
    
    return (
      <div className="flex items-center justify-between mb-2">
        <span>{description[category][permName]}</span>
        <ThreeToggle
          id={permName}
          onChange={e => togglePerm(permName, e.currentTarget.value)}
          className="float-right"
          initialValue={getValue()} />
      </div>
    );
  }

  const clearOverrides = () => {
    setAllow(0);
    setDeny(0);
    updateOverrides();
  };

  return (
    <>
      <div className="mb-5">
        <Category className="muted pb-1.5 mt-5" title={category} />
          {Object.keys(description[category]).map(permName => (
            <>
              <strong
                title={PermissionTypes.All[permName]}
                className="secondary">{permName}</strong>
              <PermToggle
                key={permName}
                permName={permName} />
            </>
          ))}
      </div>
      <NormalButton
        onClick={clearOverrides}
        className="bg-white text-black float-left"
        type="button">Clear</NormalButton>
    </>
  );
}
 
export default PermOverrides;
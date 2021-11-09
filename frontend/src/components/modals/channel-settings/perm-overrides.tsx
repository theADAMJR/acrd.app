import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const [allow, setAllow] = useState(activeOverride?.allow ?? 0);
  const [deny, setDeny] = useState(activeOverride?.deny ?? 0);

  const category = channel.type.toLowerCase();  
  // TODO: implement voice perms
  if (!activeOverride || channel.type === 'VOICE') return null;
  
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
    updateOverrides();
  }
  const updateOverrides = () => {
    activeOverride.allow = allow;
    activeOverride.deny = deny;
    
    setOverride(activeOverride);
    // FIXME: this is rerendering the toggles, which messes up their state
    dispatch(openSaveChanges(true));
  };

  const isAllowed = (name: string) => Boolean(allow & PermissionTypes.All[name]);
  const isDenied = (name: string) => Boolean(deny & PermissionTypes.All[name]);;

  const PermToggle = ({ permName }) => {    
    const getValue = () => {
      if (isAllowed(permName)) return 'on';
      else if (isDenied(permName)) return 'off';
      return 'n/a';
    };
    
    return (
      <div className="flex items-center justify-between mb-2">
        <span>{description[category][permName]}</span>
        <ThreeToggle
          id={permName}
          onChange={e => togglePerm(permName, e.currentTarget.value)}
          className="float-right"
          defaultValue={getValue()} />
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
            <div key={permName}>
              <strong
                title={PermissionTypes.All[permName]}
                className="secondary">{permName}</strong>
              <PermToggle
                key={permName}
                permName={permName} />
            </div>
          ))}
      </div>
      <NormalButton
        onClick={clearOverrides}
        className="bg-white text-black float-left"
        type="button">Clear</NormalButton>
    </>
  );
}
 
// we don't want to rerender component if save changes is updated
export default React.memo(PermOverrides);
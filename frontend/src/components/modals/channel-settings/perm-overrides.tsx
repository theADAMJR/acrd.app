import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { PermissionTypes } from '../../../services/perm-service';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import PermToggle from './perm-toggle';

export interface PermOverrides {
  allowState: [number, React.Dispatch<React.SetStateAction<number>>];
  denyState: [number, React.Dispatch<React.SetStateAction<number>>];
}
 
const PermOverrides: React.FunctionComponent<PermOverrides> = ({ allowState, denyState }) => {
  const dispatch = useDispatch();
  const { description } = usePerms();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const [allow, setAllow] = allowState;
  const [deny, setDeny] = denyState;
  
  useEffect(() => {
    console.log(allow, deny);
    setAllow(allow ?? 0);
    setDeny(deny ?? 0);
  }, [allow, deny]);

  const category = channel.type.toLowerCase();  
  // TODO: implement voice perms
  if (channel.type === 'VOICE') return null;

  const clearOverrides = () => {
    setAllow(0);
    setDeny(0);
    // dispatch(openSaveChanges(true));
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
                allowState={allowState}
                denyState={denyState}
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
 
export default PermOverrides;
import { ChannelTypes } from '@accord/types';
import { PermissionTypes } from '@accord/types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import PermToggle from './perm-toggle';

export interface PermOverrides {
  overrideState: [ChannelTypes.Override, React.Dispatch<React.SetStateAction<ChannelTypes.Override>>];
}
 
const PermOverrides: React.FunctionComponent<PermOverrides> = ({ overrideState }) => {
  const dispatch = useDispatch();
  const { description } = usePerms();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const [override, setOverride] = overrideState;

  const category = channel.type.toLowerCase();  
  if (channel.type === 'VOICE') return null;

  const clearOverrides = () => {
    setOverride({ ...override!, allow: 0, deny: 0 });
    dispatch(openSaveChanges(true));
  };

  return (
    <>
      <div className="mb-5">
        <Category
          className="muted pb-1.5 mt-5"
          title={category} />
          {Object
            .keys(description[category])
            .map(permName => (
            <div key={permName}>
              <strong
                title={PermissionTypes.All[permName]}
                className="secondary">{permName}</strong>
              <PermToggle
                overrideState={overrideState}
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
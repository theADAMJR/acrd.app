import React, { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { PermissionTypes } from '../../../services/perm-service';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import PermToggle from './perm-toggle';

export interface PermOverrides {
  activeOverride: ChannelTypes.Override | undefined;
}
 
const PermOverrides: React.FunctionComponent<PermOverrides> = ({ activeOverride }) => {
  const form = useForm<ChannelTypes.Override>();
  const dispatch = useDispatch();
  const { description } = usePerms();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  
  useEffect(() => {
    if (!activeOverride) return;

    form.setValue('roleId', activeOverride.roleId);
    form.setValue('allow', activeOverride.allow ?? 0);
    form.setValue('deny', activeOverride.deny ?? 0);
  }, [activeOverride]);

  const category = channel.type.toLowerCase();  
  // TODO: implement voice perms
  if (!activeOverride || channel.type === 'VOICE') return null;

  const clearOverrides = () => {
    form.setValue('allow', 0);
    form.setValue('deny', 0);
    dispatch(openSaveChanges(true));
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
              <PermToggle form={form} permName={permName} />
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
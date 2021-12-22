import { useState } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { updateChannel } from '../../../store/channels';
import { getGuildRoles } from '../../../store/guilds';
import { openSaveChanges } from '../../../store/ui';
import RoleMenu from '../../ctx-menus/role-menu';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import SaveChanges from '../../utils/save-changes';
import TabLink from '../../utils/tab-link';
import PermOverrides from './perm-overrides';
import ScarceSelect from './scarce-select';
import clone from 'clone';
import { uniqueBy } from '../../../store/utils/filter';
import { ChannelTypes } from '@accord/types';
 
const ChannelSettingsPerms: React.FunctionComponent = () => { 
  const { guildId }: any = useParams(); 
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const roles = useSelector(getGuildRoles(guildId));  
  const dispatch = useDispatch();
  const defaultOverride = clone(channel.overrides?.[0]) ?? {
    allow: 0,
    deny: 0,
    roleId: roles[0].id,
  };
  const [override, setOverride] = useState(defaultOverride);
  const [roleId, setRoleId] = useState(override.roleId);

  const unaddedRoles = roles.filter(r => !channel.overrides?.some(o => o.roleId === r.id));
  const overrideRoles = roles.filter(r => channel.overrides?.some(o => o.roleId === r.id));

  const deleteActiveOverride = () => {
    setOverride({ ...override!, allow: 0, deny: 0 });
    dispatch(openSaveChanges(true));
  }

  const RoleDetails: React.FunctionComponent = () => {
    const onSave = (e) => {
      const cloned: ChannelTypes.Override[] = clone(channel.overrides) ?? [override!];
      const filtered = cloned
        .filter(c => c.allow + c.deny > 0)
        .filter(uniqueBy('roleId'));
      
      const index = filtered.findIndex(o => o.roleId === roleId);
      (index < 0)
        ? filtered.push(override)
        : filtered[index] = override!;
  
      dispatch(updateChannel(channel.id, { overrides: filtered }));
    }
    const onReset = () => setOverride(defaultOverride);

    return (
      <>
        <PermOverrides overrideState={[override, setOverride]} />
        <NormalButton
          onClick={deleteActiveOverride}
          className="bg-danger float-right"
          type="button">Delete</NormalButton>
        <SaveChanges
          onSave={onSave}
          onReset={onReset}
          obj={override} />  
      </>
    );
  };

  const role = roles.find(r => r.id === roleId);
  const alreadyActive = channel.overrides?.some(o => o.roleId === roleId);
  if (override && role && !alreadyActive)
    overrideRoles.push(role);

  return (
    <div className="grid grid-cols-12 flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <div className="lg:col-span-3 col-span-12">
        <nav className="pr-10">
          {overrideRoles.map(r => (
            <ContextMenuTrigger id={r.id} key={r.id}>
              <TabLink
                style={{ color: r.color }}
                tab={roleId}
                setTab={setRoleId}
                id={r.id}>{r.name}</TabLink>
              <RoleMenu role={r} />
            </ContextMenuTrigger>
          ))}

          <Category className="m-1 mt-3" title="Add Role" />
          <ScarceSelect
            mapOptions={r => ({ label: r.name, value: r.id, color: r.color })}
            onChange={select => {
              const roleId = select.value;
              setOverride({ allow: 0, deny: 0, roleId });
              setRoleId(roleId);
            }}
            unadded={unaddedRoles} />
        </nav>
      </div>
      <div className="lg:col-span-9 col-span-12">
        <RoleDetails />
      </div>
    </div>
  );
}
 
export default ChannelSettingsPerms;
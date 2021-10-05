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
 
const ChannelSettingsPerms: React.FunctionComponent = () => {  
  const { guildId }: any = useParams();
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;

  const byPosition = (a, b) => (a.position > b.position) ? 1 : -1;
  const allRoles = useSelector(getGuildRoles(guildId)).sort(byPosition);

  const defaultOverride = channel.overrides?.[0];
  const [activeOverride, setOverride] = useState(
    (defaultOverride)
      ? { ...defaultOverride } as ChannelTypes.Override
      : undefined,
  );
  
  const unaddedRoles = allRoles.filter(r => !channel.overrides?.some(o => o.roleId === r.id));
  const overrideRoles = allRoles.filter(r => channel.overrides?.some(o => o.roleId === r.id));
  const [activeRoleId, setActiveRoleId] = useState(overrideRoles[0]?.id ?? '');

  const deleteActiveOverride = () => {
    setOverride({ allow: 0, deny: 0, roleId: activeRoleId });
    setActiveRoleId('');
    dispatch(openSaveChanges(true));
  }

  const RoleDetails = () => {    
    return (
      <>
        {/* <PermOverrides
          setOverride={setOverride}
          activeOverride={activeOverride} /> */}
        <div>In development...</div>
        {/* <NormalButton
          onClick={deleteActiveOverride}
          className="bg-danger float-right"
          type="button">Delete</NormalButton> */}
      </>
    );
  }

  const onSave = (e) => {
    const overrides = JSON.parse(JSON.stringify(channel.overrides)) ?? [];
    if (activeOverride && activeOverride.allow + activeOverride.deny > 0)
      overrides.push(activeOverride);

    dispatch(updateChannel(channel.id, { overrides }));
  };

  const role = allRoles.find(r => r.id === activeRoleId);
  const alreadyActive = channel.overrides?.some(o => o.roleId === activeRoleId);
  if (activeOverride && role && !alreadyActive)
    overrideRoles.push(role);

  return (
    <div className="grid grid-cols-12 flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <div className="lg:col-span-3 col-span-12">
        <nav className="pr-10">
          {overrideRoles.sort(byPosition).map(r => (
            <ContextMenuTrigger id={r.id} key={r.id}>
              <TabLink
                style={{ color: r.color }}
                tab={activeRoleId}
                setTab={setActiveRoleId}
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
              setActiveRoleId(roleId);
            }}
            unadded={unaddedRoles} />
        </nav>
      </div>
      <div className="lg:col-span-9 col-span-12">
        {activeOverride && <RoleDetails />}
      </div>

      <SaveChanges
        onSave={onSave}
        obj={{ overrides: activeOverride }} />  
    </div>
  );
}
 
export default ChannelSettingsPerms;
import { useEffect, useMemo, useState } from 'react';
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
 
const ChannelSettingsPerms: React.FunctionComponent = () => {  
  const { guildId }: any = useParams();
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const allowState = useState(0);
  const denyState = useState(0);
  const [override, setOverride] = useState(
    (channel.overrides?.length) ? clone(channel.overrides[0]) : null
  );

  const byPosition = (a, b) => (a.position > b.position) ? 1 : -1;
  const allRoles = useSelector(getGuildRoles(guildId)).sort(byPosition);
  const [allow, setAllow] = allowState;
  const [deny, setDeny] = denyState;

  useEffect(() => {
    if (!override) return;
    
    setAllow(override.allow);
    setDeny(override.deny);
  }, [override]);

  
  const unaddedRoles = allRoles.filter(r => !channel.overrides?.some(o => o.roleId === r.id));
  const overrideRoles = allRoles.filter(r => channel.overrides?.some(o => o.roleId === r.id));
  const [activeRoleId, setActiveRoleId] = useState(overrideRoles[0]?.id ?? '');

  const deleteActiveOverride = () => {
    setOverride({ allow: 0, deny: 0, roleId: activeRoleId });
    setActiveRoleId('');
    // dispatch(openSaveChanges(true));
  }

  const RoleDetails = () => {    
    const memo = useMemo(() => (
      <>
        <PermOverrides
          allowState={allowState}
          denyState={denyState} />
        <NormalButton
          onClick={deleteActiveOverride}
          className="bg-danger float-right"
          type="button">Delete</NormalButton>
      </>
    ), [override]);

    return (override) ? memo : null;
  }

  const onSave = (e) => {
    let overrides: ChannelTypes.Override[] = JSON.parse(JSON.stringify(
      channel.overrides ?? [override]
    ));
    overrides = overrides.filter(c => c.allow + c.deny > 0);

    const index = overrides.findIndex(o => o.roleId === activeRoleId);
    overrides[index] = override!;

    dispatch(updateChannel(channel.id, { overrides }));
  };

  const role = allRoles.find(r => r.id === activeRoleId);
  const alreadyActive = channel.overrides?.some(o => o.roleId === activeRoleId);
  if (override && role && !alreadyActive)
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
        <RoleDetails />
      </div>

      <SaveChanges
        onSave={onSave}
        obj={{ overrides: override }} />  
    </div>
  );
}
 
export default ChannelSettingsPerms;
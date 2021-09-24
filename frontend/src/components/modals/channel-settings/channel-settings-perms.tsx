import { useState } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { updateChannel } from '../../../store/channels';
import { getGuildRoles } from '../../../store/guilds';
import RoleMenu from '../../ctx-menus/role-menu';
import NormalButton from '../../utils/buttons/normal-button';
import SaveChanges from '../../utils/save-changes';
import TabLink from '../../utils/tab-link';
import PermOverrides from './perm-overrides';
 
const ChannelSettingsPerms: React.FunctionComponent = () => {  
  const { guildId }: any = useParams();
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const [activeRoleId, setActiveRoleId] = useState(channel.overrides?.[0].roleId);
  const [overrides, setOverrides] = useState(channel.overrides ?? []);
  const roles = useSelector(getGuildRoles(guildId));

  const activeOverride = overrides.find(o => o.roleId === activeRoleId);

  const deleteActiveOverride = () => {
    const index = overrides?.findIndex(o => o.roleId === activeRoleId);
    overrides.splice(index, 1);
    setOverrides(overrides);
  }

  const RoleDetails = () => {    
    return (activeOverride) ? (
      <>
        <PermOverrides
          overrides={overrides}
          setOverrides={setOverrides}
          activeOverride={activeOverride} />
        <NormalButton
          onClick={deleteActiveOverride}
          className="bg-danger float-right"
          type="button">Delete</NormalButton>
      </>
    ) : null;
  }

  const onSave = (e) => {
    const filtered = overrides.filter(o => o.allow + o.deny > 0);
    dispatch(updateChannel(channel.id, { overrides: filtered }));
  };  
  const byPosition = (a, b) => (a.position > b.position) ? -1 : 1;

  return (
    <div className="grid grid-cols-12 flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <div className="lg:col-span-3 col-span-12">
        <nav className="pr-10">
          {roles.sort(byPosition).map(r => (
            <ContextMenuTrigger id={r.id} key={r.id}>
              <TabLink
                key={r.id}
                style={{ color: r.color }}
                tab={activeRoleId}
                setTab={setActiveRoleId}
              id={r.id}>{r.name}</TabLink>
              <RoleMenu role={r} />
            </ContextMenuTrigger>
          ))}
          {/* add override to array */}
        </nav>
      </div>
      <div className="lg:col-span-9 col-span-12">
        {overrides && <RoleDetails />}
      </div>

      <SaveChanges
        setValue={(...args) => { setOverrides(overrides); }}
        onSave={onSave}
        obj={overrides} />  
    </div>
  );
}
 
export default ChannelSettingsPerms;
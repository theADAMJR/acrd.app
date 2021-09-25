import { useState } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Select from 'react-select';
import { updateChannel } from '../../../store/channels';
import { getGuildRoles } from '../../../store/guilds';
import RoleMenu from '../../ctx-menus/role-menu';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import SaveChanges from '../../utils/save-changes';
import TabLink from '../../utils/tab-link';
import PermOverrides from './perm-overrides';
 
const ChannelSettingsPerms: React.FunctionComponent = () => {  
  const { guildId }: any = useParams();
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;

  const byPosition = (a, b) => (a.position > b.position) ? -1 : 1;
  const allRoles = useSelector(getGuildRoles(guildId)).sort(byPosition);
  const [overrides, setOverrides] = useState(channel.overrides ?? []);
  
  const unaddedRoles = allRoles.filter(r => !overrides.some(o => o.roleId === r.id));
  const overrideRoles = allRoles.filter(r => overrides.some(o => o.roleId === r.id));
  const [activeRoleId, setActiveRoleId] = useState(overrideRoles[0]?.id ?? '');
  
  const activeOverride = overrides.find(o => o.roleId === activeRoleId);

  const deleteActiveOverride = () => {
    const index = overrides?.findIndex(o => o.roleId === activeRoleId);
    overrides.splice(index, 1);
    setOverrides(overrides);
    setActiveRoleId('');
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

  const colorStyles = {
    singleValue: () => ({ display: 'none' }),
    control: () => ({
      width: '100%',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '5px',
    }),
    option: (styles, { data }) => ({
      ...styles,
      color: data.color,
      backgroundColor: 'var(--bg-secondary)',
      cursor: 'pointer',
    }),
    input: (styles) => ({ ...styles, color: 'var(--font)' }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: 'var(--bg-secondary)',
    }),
    multiValue: (styles) => ({
      ...styles,
      color: 'var(--font)',
      backgroundColor: 'var(--bg-tertiary)',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: (styles) => ({ ...styles, float: 'right' }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
      backgroundColor: 'var(--bg-tertiary)',
    }),
  };

  return (
    <div className="grid grid-cols-12 flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <div className="lg:col-span-3 col-span-12">
        <nav className="pr-10">
          {overrideRoles.sort(byPosition).map(r => (
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

          <Category className="muted m-1 mt-3" title="Add Role" />
          <Select
            placeholder="Add role..."
            options={unaddedRoles.map(r => ({
              label: r.name,
              value: r.id,
              color: r.color,
            }))}
            styles={colorStyles}
            onChange={select => {
              const roleId = select.value;
              overrides.push({ allow: 0, deny: 0, roleId });
              setOverrides(overrides);
              setActiveRoleId(roleId);
            }} 
            noOptionsMessage={() => 'All roles have been added'} />
        </nav>
      </div>
      <div className="lg:col-span-9 col-span-12">
        {overrides && <RoleDetails />}
      </div>

      <SaveChanges
        setValue={(obj: any) => console.log(obj)}
        onSave={onSave}
        obj={{ overrides }} />  
    </div>
  );
}
 
export default ChannelSettingsPerms;
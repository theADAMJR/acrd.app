import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { getGuildRoles } from '../../../store/guilds';
import { useState } from 'react';
import { updateMember } from '../../../store/members';
import usePerms from '../../../hooks/use-perms';
import { Entity } from '@accord/types';

export interface RoleManagerProps {
  member: Entity.GuildMember;
}

const RoleManager: React.FunctionComponent<RoleManagerProps> = ({ member }) => {
  const removeEveryone = (arr: any[]) => arr.filter(r => r.name !== '@everyone');
  const slicedRoleIds = removeEveryone(member.roleIds);

  const perms = usePerms();
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const roles = removeEveryone(useSelector(getGuildRoles(guild.id)));
  const [roleIds, setRoleIds] = useState(slicedRoleIds);

  const colorStyles = {
    control: () => ({
      width: '200px',
      backgroundColor: 'var(--bg-secondary)',
    }),
    option: (styles, { data }) => ({
      ...styles,
      color: data.color,
      backgroundColor: 'var(--bg-secondary)',
      cursor: (data.disabled) ? 'not-allowed' : 'pointer',
      opacity: (data.disabled) ? 0.5 : 1,
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
  
  const rolesHaveChanged = JSON.stringify(roleIds) !== JSON.stringify(slicedRoleIds);
  const roleOption = (role: Entity.Role) => ({
    label: role.name,
    value: role.id,
    color: role.color,
    disabled: !perms.memberIsHigher(guild.id, [role.id]),
  });
  
  return (
    <div onClick={e => e.preventDefault()}>
      <Select
        defaultValue={roleIds.map(id => {
          const role = roles.find(r => r.id === id);
          return (role) ? roleOption(role) : undefined;
        })}
        name="colors"
        options={roles.map(roleOption)}
        isOptionDisabled={(option) => option.disabled}
        onChange={options => setRoleIds(options.map(o => o.value))}
        onMenuClose={() => rolesHaveChanged && dispatch(updateMember(member.id, { roleIds }))}
        styles={colorStyles}
        placeholder="Add roles..."
        noOptionsMessage={() => 'No roles to add'}
        // onChange={e => setRoleIds(e.currentTarget.value as any)}
        // onClick={() => dispatch(updateMember(member.id, { roleIds }))}
        isMulti />
    </div>
  );
}

export default RoleManager;
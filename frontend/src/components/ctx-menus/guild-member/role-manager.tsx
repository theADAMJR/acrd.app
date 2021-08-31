import Select from 'react-select';
import { useSelector } from 'react-redux';
import { getGuildRoles } from '../../../store/guilds';
import { useState } from 'react';

export interface RoleManagerProps {
  member: Entity.GuildMember;
}

const RoleManager: React.FunctionComponent<RoleManagerProps> = ({ member }) => {
  const removeEveryone = (arr: any[]) => arr.slice(1);
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const roles = removeEveryone(useSelector(getGuildRoles(guild.id)));
  const [roleIds, setRoleIds] = removeEveryone(useState(member.roleIds));

  const colorStyles = {
    control: () => ({
      width: '200px',
      backgroundColor: 'var(--bg-secondary)',
    }),
    option: (styles, { data, isFocused }) => ({
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
    indicatorsContainer: (styles) => ({ ...styles, marginBottom: '-7.5px', float: 'right' }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
      backgroundColor: 'var(--bg-tertiary)',
    }),
  };
  
  return (
    <div onClick={e => e.preventDefault()}>
      <Select
        defaultValue={roleIds}
        name="colors"
        options={roles.map(r => ({
          label: r.name,
          value: r.id,
          color: r.color,
        }))}
        styles={colorStyles}
        // onChange={e => setRoleIds(e.currentTarget.value as any)}
        // onClick={() => dispatch(updateMember(member.id, { roleIds }))}
        isMulti />
    </div>
  );
}

export default RoleManager;
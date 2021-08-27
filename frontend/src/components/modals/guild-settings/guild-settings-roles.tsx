import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { PermissionTypes } from '../../../services/perm-service';
import { getGuildRoles } from '../../../store/guilds';
import { getRole } from '../../../store/roles';
import Input from '../../utils/input';
import TabLink from '../../utils/tab-link';
 
const GuildSettingsRoles: React.FunctionComponent = () => {  
  const permsForm = useForm();
  const { guildId }: any = useParams();
  const roles = useSelector(getGuildRoles(guildId));
  const [activeRoleId, setActiveRoleId] = useState(roles[0].id);
  const activeRole = useSelector(getRole(activeRoleId));
  
  const getPermissions = (): number  => {
    const value = permsForm.getValues();
    
    let permissions = 0;
    for (const formGroupName in value)
      for (const key in value[formGroupName]) {
        const hasPermission = value[formGroupName][key];
        permissions |= (hasPermission)
          ? PermissionTypes.General[key] || PermissionTypes.Text[key] || PermissionTypes.Voice[key]
          : 0;
      }
    return permissions;
  }
  
  const description = {
    general: {
      'ADMINISTRATOR': `Gives all permissions. This is a dangerous permission.`,
      'CREATE_INVITE': 'Ability to create invites for users to join this guild.',
      'KICK_MEMBERS': 'Ability to kick members from this guild.',
      'MANAGE_CHANNELS': 'Ability to create, edit, or delete channels.',
      'MANAGE_GUILD': `Ability to edit general guild settings.`,
      'MANAGE_ROLES': 'Ability to manage guild roles.',
      'VIEW_CHANNELS': 'Ability to view channels.',
    },
    text: {
      'MANAGE_MESSAGES': `Ability to manage message other member's messages.`,
      'READ_MESSAGES': `Ability to read messages,`,
      'SEND_MESSAGES': 'Ability to send messages in text channels.',
    },
  };

  const RoleDetails = () => {
    const elements: JSX.Element[] = [];

    for (const category in description) {
      elements.push(<p>{category}</p>);
      for (const permName in description[category])
        elements.push(
          <Input
            name={permName}
            register={permsForm.register} />
        );
    }

    return (
      <form>
        {elements}
      </form>
    )
  }

  return (
    <form className="grid grid-cols-12 flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <div className="lg:col-span-3 col-span-12">
        {roles.map(r => (
          <TabLink
            tab={activeRoleId}
            setTab={setActiveRoleId}
            id={r.id}>{r.name}</TabLink>))}
      </div>
      <div className="lg:col-span-9 col-span-12">
        {activeRole && <RoleDetails />}
      </div>
    </form>
  );
}
 
export default GuildSettingsRoles;
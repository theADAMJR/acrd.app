import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PermissionTypes } from '../../../services/perm-service';
import { getGuildRoles } from '../../../store/guilds';
import { getRole } from '../../../store/roles';
import { actions as ui, openSaveChanges } from '../../../store/ui';
import Category from '../../utils/category';
import Input from '../../utils/input/input';
import Toggle from '../../utils/input/toggle';
import SaveChanges from '../../utils/save-changes';
import TabLink from '../../utils/tab-link';
 
const GuildSettingsRoles: React.FunctionComponent = () => {  
  const dispatch = useDispatch();
  const permsForm = useForm();
  const detailsForm = useForm();
  const { guildId }: any = useParams();
  const roles = useSelector(getGuildRoles(guildId));
  const [activeRoleId, setActiveRoleId] = useState(roles[0].id);
  const activeRole = useSelector(getRole(activeRoleId));
  
  // const getPermissions = (): number  => {
  //   const value = permsForm.getValues();
    
  //   let permissions = 0;
  //   for (const formGroupName in value)
  //     for (const key in value[formGroupName]) {
  //       const hasPermission = value[formGroupName][key];
  //       permissions |= (hasPermission)
  //         ? PermissionTypes.General[key] || PermissionTypes.Text[key] || PermissionTypes.Voice[key]
  //         : 0;
  //     }
  //   return permissions;
  // }
  useEffect(() => {
    for (const key in PermissionTypes.All) {
      if (Number.parseInt(key)) return;

      console.log(key);      
    }

    // permsForm.setValue(activeRole!.permissions);
  }, [activeRole?.id]);
  
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
    for (const key in activeRole)
      detailsForm.setValue(key, activeRole[key]);
    
    return (
      <form
        className="mb-10"
        onChange={() => dispatch(openSaveChanges(true))}>
        <div className="flex gap-4">
          {/* We cannot change name of @everyone */}
          <Input
            label="Name"
            name="name"
            register={detailsForm.register} />
          <Input
            label="Color"
            name="color"
            type="color"
            register={detailsForm.register} />
        </div>      
      </form>
    )
  }

  const RolePermissions = () => {
    const elements: JSX.Element[] = [];

    const has = (perm: number) => Boolean(activeRole!.permissions & perm);
    for (const category in description) {
      elements.push(
        <Category
          className="muted px-2.5 pb-1.5"
          title={category} />
      );
      for (const permName in description[category])
        elements.push(
          <div key={permName} className="flex items-center justify-between mb-2">
            <span>{description[category][permName]}</span>
            <Toggle
              checked={has(PermissionTypes.All[permName])}
              name={permName}
              register={permsForm.register}
              className="float-right" />
          </div>
        );
    }

    return (
      <form onChange={() => dispatch(openSaveChanges(true))}>
        {elements}
      </form>
    )
  }

  const onSave = () => alert('hi');

  return (
    <div className="grid grid-cols-12 flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <div className="lg:col-span-3 col-span-12">
        {roles.map(r => (
          <TabLink
            key={r.id}
            tab={activeRoleId}
            setTab={setActiveRoleId}
            id={r.id}>{r.name}</TabLink>))}
      </div>
      <div className="lg:col-span-9 col-span-12">
        {activeRole && (<>
          <RoleDetails />
          <RolePermissions />
        </>)}
      </div>

      <SaveChanges
        setValue={detailsForm.setValue}
        onSave={onSave}
        obj={detailsForm.getValues()} />  
    </div>
  );
}
 
export default GuildSettingsRoles;
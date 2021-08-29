import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getGuildRoles } from '../../../store/guilds';
import { deleteRole, getRole, updateRole } from '../../../store/roles';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Input from '../../utils/input/input';
import SaveChanges from '../../utils/save-changes';
import TabLink from '../../utils/tab-link';
import RolePermissions from './role-permissions';
 
const GuildSettingsRoles: React.FunctionComponent = () => {  
  const dispatch = useDispatch();
  const [perms, setPerms] = useState(0);
  const { handleSubmit, register, setValue, getValues } = useForm();
  const { guildId }: any = useParams();
  const roles = useSelector(getGuildRoles(guildId));
  const [activeRoleId, setActiveRoleId] = useState(roles[0].id);
  const activeRole = useSelector(getRole(activeRoleId));

  useEffect(() => {
    if (!activeRole) return;

    for (const name of ['name', 'color', 'permissions'])
      setValue(name, activeRole[name]);
    setPerms(activeRole.permissions);
  }, [activeRole]);

  const RoleDetails = () => {    
    return (
      <form
        className="mb-10"
        onChange={() => dispatch(openSaveChanges(true))}>
        <div className="flex gap-4">
          <Input
            // disabled={activeRole!.name === '@everyone'}
            label="Name"
            name="name"
            register={register} />
          <Input
            // disabled={activeRole!.name === '@everyone'}
            label="Color"
            name="color"
            type="color"
            register={register} />
        </div>
  
        <RolePermissions
          perms={perms}
          setPerms={setPerms}
          setValue={setValue}  />
        <NormalButton
          onClick={() => dispatch(deleteRole(activeRole!.guildId, activeRole!.id))}
          className="bg-danger float-right"
          type="button">Delete</NormalButton>
      </form>
    )
  }

  const onSave = (e) => {
    const { guildId, id } = activeRole!;
    const onUpdate = (payload) => dispatch(updateRole(guildId, id, payload));
    handleSubmit(onUpdate)(e);
  };

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
        {activeRole && <RoleDetails />}
      </div>

      <SaveChanges
        setValue={(...args) => {
          setValue(...args);
          setPerms(activeRole!.permissions);
        }}
        onSave={onSave}
        obj={getValues()} />  
    </div>
  );
}
 
export default GuildSettingsRoles;
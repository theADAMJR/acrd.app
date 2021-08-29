import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { permDescription, PermissionTypes } from '../../../services/perm-service';
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
  const { handleSubmit, register, setValue, getValues } = useForm();
  const { guildId }: any = useParams();
  const roles = useSelector(getGuildRoles(guildId));
  const [activeRoleId, setActiveRoleId] = useState(roles[0].id);
  const activeRole = useSelector(getRole(activeRoleId));

  useEffect(() => {
    if (!activeRole) return;

    for (const name of ['color', 'role', 'permissions'])
      setValue(name, activeRole[name]);
  }, [activeRole]);

  const RoleDetails = () => {    
    return (
      <form
        className="mb-10"
        onChange={() => dispatch(openSaveChanges(true))}>
        <div className="flex gap-4">
          {/* We cannot change name of @everyone */}
          <Input
            name="permissions"
            type="hidden"
            register={register} />
          <Input
            label="Name"
            name="name"
            register={register} />
          <Input
            label="Color"
            name="color"
            type="color"
            register={register} />
        </div>
  
        <RolePermissions />
      </form>
    )
  }

  const togglePerm = (name: string, on: boolean) =>
    setValue('permissions', (on)
      ? activeRole!.permissions | PermissionTypes.All[name]
      : activeRole!.permissions & ~PermissionTypes.All[name]);

  const RolePermissions = () => {
    const has = (name: string) => Boolean(getValues().permissions & PermissionTypes.All[name]);

    const PermToggle = ({ category, permName }) => (
      <div key={permName} className="flex items-center justify-between mb-2">
        <span>{permDescription[category][permName]}</span>
        <Toggle
          name={permName}
          checked={has(permName)}
          onClick={v => togglePerm(permName, !v.currentTarget.checked)}
          className="float-right" />
      </div>
    );

    return <>
      {Object.keys(permDescription).map(category => <>
        <Category
          key={category}
          className="muted px-2.5 pb-1.5"
          title={category} />
        {Object.keys(permDescription[category]).map(permName =>
          <PermToggle category={category} permName={permName} />)}
      </>)}
    </>;
  }

  const onSave = (e) => {
    handleSubmit((e) => console.log(e))(e);
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
        setValue={setValue}
        onSave={onSave}
        obj={getValues()} />  
    </div>
  );
}
 
export default GuildSettingsRoles;
import classNames from 'classnames';
import { useEffect } from 'react';
import { useState } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import usePerms from '../../../hooks/use-perms';
import { getGuildRoles } from '../../../store/guilds';
import { createRole, deleteRole, getRole, updateRole } from '../../../store/roles';
import { openSaveChanges } from '../../../store/ui';
import RoleMenu from '../../ctx-menus/role-menu';
import CircleButton from '../../utils/buttons/circle-button';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Input from '../../inputs/input';
import Toggle from '../../inputs/toggle';
import SaveChanges from '../../utils/save-changes';
import TabLink from '../../utils/tab-link';
import RolePermissions from './role-permissions';
 
const GuildSettingsRoles: React.FunctionComponent = () => {  
  const dispatch = useDispatch();
  const { handleSubmit, register, setValue, getValues } = useForm();
  const { guildId }: any = useParams();
  const roles = useSelector(getGuildRoles(guildId));
  const [activeRoleId, setActiveRoleId] = useState(roles[0].id);
  const activeRole = useSelector(getRole(activeRoleId));
  const [perms, setPerms] = useState(0);
  const [hoisted, setHoisted] = useState(false);
  const permsService = usePerms();

  useEffect(() => {
    if (!activeRole) return setActiveRoleId(roles[0].id);

    for (const name of ['name', 'color', 'permissions', 'hoisted'])
      setValue(name, activeRole[name]);
    setPerms(activeRole.permissions);
    setHoisted(activeRole.hoisted);
  }, [activeRole]);

  const RoleDetails = () => {
    return (
      <form
        className="mb-10"
        onChange={() => dispatch(openSaveChanges(true))}>
        <div className="flex gap-4">
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

        <div className="mt-5">
          <Category title="Options" className=" pb-1.5 mt-5" />
          <span>
            <span>Separate role on member list</span>
            <Toggle
              id="hoisted"
              checked={hoisted}
              {...register('hoisted')}
              onChange={() => {
                setHoisted(!hoisted);
                setValue('hoisted', !hoisted);
              }}
              className="float-right" />
          </span>
        </div>
  
        <RolePermissions
          perms={perms}
          setPerms={setPerms}
          setRoleValue={setValue}  />
        <NormalButton
          onClick={() => dispatch(deleteRole(guildId, activeRole!.id))}
          className="bg-danger float-right"
          type="button">Delete</NormalButton>
      </form>
    );
  }

  const onSave = (e) => {
    const onUpdate = (payload) => dispatch(updateRole(guildId, activeRole!.id, payload));
    handleSubmit(onUpdate)(e);
  };  
  const byPosition = (a, b) => (a.position > b.position) ? -1 : 1;
  const selfIsHigher = (r) => permsService.memberIsHigher(guildId, [r.id]);

  return (
    <div className="grid grid-cols-12 flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <div className="lg:col-span-3 col-span-12">
        <nav className="pr-10">
          {roles.sort(byPosition).map(r => (
            <ContextMenuTrigger id={r.id} key={r.id}>
              <TabLink
                className={classNames({
                  'cursor-not-allowed opacity-25': !selfIsHigher(r),
                })}
                key={r.id}
                style={{ color: r.color }}
                tab={activeRoleId}
                setTab={(...args) => selfIsHigher(r) && setActiveRoleId(...args)}
                id={r.id}>{r.name}</TabLink>
              <RoleMenu role={r} />
            </ContextMenuTrigger>
          ))}
          <CircleButton
            onClick={() => dispatch(createRole(guildId))}
            style={{ color: 'var(--success)' }}
            className="ring-green-500 m-2">Create</CircleButton>
        </nav>
      </div>
      <div className="lg:col-span-9 col-span-12">
        {activeRole && <RoleDetails />}
      </div>

      <SaveChanges
        setValue={(...args) => {
          setValue(...args);
          setPerms(activeRole!.permissions);
          setHoisted(activeRole!.hoisted);
        }}
        onSave={onSave}
        obj={getValues()} />  
    </div>
  );
}
 
export default GuildSettingsRoles;
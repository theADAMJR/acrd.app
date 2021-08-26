import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateGuild } from '../../../store/guilds';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Input from '../../utils/input';
import SaveChanges from '../../utils/save-changes';
 
const GuildSettingsRoles: React.FunctionComponent = () => {
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const dispatch = useDispatch();
  const { handleSubmit, setValue } = useForm();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const onSave = (e) => {
    const onUpdate = (payload) => dispatch(updateGuild(guild.id, payload));
    closeSnackbar('saveChanges');
    handleSubmit(onUpdate)(e);
  };
  const onReset = () => {
    closeSnackbar('saveChanges');
    for (const key in guild)
      setValue(key, guild[key]);
  };

  const openSaveChanges = (onReset, onSave) => {
    enqueueSnackbar('', {
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      content: SaveChanges({ id: 'saveChanges', onReset, onSave }),
      key: 'saveChanges',
      persist: true,
    });
  };

  return (
    <form
      onChange={() => openSaveChanges(onReset, onSave)}
      className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Roles</h1>
      </header>
    </form>
  );
}
 
export default GuildSettingsRoles;
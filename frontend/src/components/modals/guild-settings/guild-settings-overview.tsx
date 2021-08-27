import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGuild, updateGuild } from '../../../store/guilds';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Input from '../../utils/input';
import SaveChanges from '../../utils/save-changes';
 
const GuildSettingsOverview: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const { register, handleSubmit, setValue } = useForm();
  const [saveChangesOpen, openSaveChanges] = useState(false);

  const onSave = (e) => {
    const onUpdate = (payload) => dispatch(updateGuild(guild.id, payload));
    handleSubmit(onUpdate)(e);
  };
  const onDelete = () => {
    const confirmation = window.confirm('Are you sure you want to delete this server?');
    confirmation && dispatch(deleteGuild(guild.id));
  }
  
  return (
    <form
      onChange={() => openSaveChanges(true)}
      className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Server Overview</h1>
      </header>
    
      <section className="w-1/3">
        <Input
          label="Name"
          name="name"
          register={register}
          options={{ value: guild.name }}
          className="pt-5" />
        <Input
          label="Icon URL"
          name="iconURL"
          register={register}
          options={{ value: guild.iconURL }}
          className="pt-5" />
      </section>

      <Category
        className="py-2 mt-5"
        title="Advanced Settings" />

      <section>
        <NormalButton
          type="button"
          onClick={onDelete}
          className="bg-danger">Delete</NormalButton>
      </section>

      {saveChangesOpen && (
        <SaveChanges
          setValue={setValue}
          onSave={onSave}
          obj={guild} />
      )}
    </form>    
  );
}
 
export default GuildSettingsOverview;
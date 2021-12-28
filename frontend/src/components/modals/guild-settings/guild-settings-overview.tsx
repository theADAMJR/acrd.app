import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGuild, getGuildChannels, updateGuild, uploadGuildIcon } from '../../../store/guilds';
import { openSaveChanges } from '../../../store/ui';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import SaveChanges from '../../utils/save-changes';
import Input from '../../inputs/input';
import ChannelSelect from '../../inputs/channel-select';
 
const GuildSettingsOverview: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const channels = useSelector(getGuildChannels(guild.id));
  const { register, handleSubmit, setValue } = useForm();

  const onSave = (e) => {
    const onUpdate = (payload) => dispatch(updateGuild(guild.id, payload));
    handleSubmit(onUpdate)(e);
  };
  const onDelete = () => {
    const confirmation = window.confirm('Are you sure you want to delete this guild?');
    if (confirmation) dispatch(deleteGuild(guild.id));
  }
  
  return (
    <form
      onChange={() => dispatch(openSaveChanges(true))}
      className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Guild Overview</h1>
      </header>
    
      <section className="w-1/2">
        <Input
          label="Name"
          name="name"
          register={register}
          options={{ value: guild.name }}
          className="pt-5" />
        <Input
          type="file"
          accept="image/*"
          label="Icon Image"
          name="iconURL"
          className="pt-5"
          options={{ value: guild.iconURL }}
          onChange={(e) => {
            const file = e.currentTarget?.files?.[0];
            if (file) dispatch(uploadGuildIcon(guild.id, file));
          }} />
        <ChannelSelect
          // onChange={() => dispatch(openSaveChanges(true))}
          className="pt-5"
          label="System Channel"
          name="systemChannelId"
          channels={channels}
          register={register}
          options={{ setValueAs: guild.systemChannelId }} />
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

      <SaveChanges
        setValue={setValue}
        onSave={onSave}
        obj={guild} />
    </form>    
  );
}
 
export default GuildSettingsOverview;
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGuild, updateGuild } from '../../store/guilds';
import Category from '../utils/category';
import Input from '../utils/input';
import NormalButton from '../utils/buttons/normal-button';
import Modal from './modal';
import { Link } from 'react-router-dom';

const GuildSettings: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppStore) => s.ui.activeGuild)!;
  const { register, handleSubmit } = useForm();

  const onUpdate = (payload) => dispatch(updateGuild(guild.id, payload));
  const onDelete = () => {
    const confirmation = window.confirm('Are you sure you want to delete this server?');
    confirmation && dispatch(deleteGuild(guild.id));
  }
  
  return (guild) ? (
    <Modal type={GuildSettings} size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 bg-bg-secondary">
          <nav className="float-right flex-grow py-14 w-48 my-1 mr-4">
            <Category
              className="muted px-2.5 pb-1.5"
              title={guild.name} />
            <Link
              to="#"
              className="active flex items-center rounded py-1.5 px-2.5 h-8 mb-0.5">Overview</Link>
          </nav>
        </div>

        <div className="col-span-8 h-full">
          <form className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
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
              <NormalButton
                onClick={handleSubmit(onUpdate)}
                className="bg-success ml-4">Save</NormalButton>
            </section>
          </form>
        </div>
      </div>
    </Modal>
  ) : null;
}
 
export default GuildSettings;
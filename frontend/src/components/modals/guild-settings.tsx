import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGuild, updateGuild } from '../../store/guilds';
import Category from '../utils/category';
import Input from '../utils/input';
import Modal from './modal';

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
        <div className="col-span-3 bg-bg-secondary">
          {/* TODO: add overview tab here */}
        </div>

        <div className="col-span-8 h-full">
          <form
            style={{padding: '60px 40px 80px'}}
            className="h-full flex flex-col">
            <header>
              <h1 className="text-xl font-bold inline">Server Overview</h1>
            </header>
          
            <div className="flex-grow">
              <div className="pt-5">
                <Input
                  label="Name"
                  name="name"
                  register={register}
                  options={{ value: guild.name }} />
              </div>

              <div className="pt-5">
                <Input
                  label="Icon URL"
                  name="iconURL"
                  register={register}
                  options={{ value: guild.iconURL }} />
              </div>
            </div>

            <Category title="Advanced Settings" />

            <div>
              <button
                onClick={onDelete}
                type="button"
                style={{height: '38px', padding: '2px 16px'}}
                className="background bg-danger heading rounded-md m-4">Delete</button>

              <button
                onClick={handleSubmit(onUpdate)}
                type="button"
                style={{height: '38px', padding: '2px 16px'}}
                className="background bg-success heading rounded-md m-4">Save</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  ) : null;
}
 
export default GuildSettings;
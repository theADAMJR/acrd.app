import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGuild, updateGuild } from '../../store/guilds';
import { closedModal } from '../../store/ui';
import Category from '../category';

const GuildSettings: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const guild = useSelector((s: Store.AppStore) => s.ui.activeGuild)!;
  const openModal = useSelector((s: Store.AppStore) => s.ui.openModal)!;
  const { register, handleSubmit } = useForm();

  const onUpdate = (payload) => dispatch(updateGuild(guild.id, payload));
  const onDelete = () => {
    const confirmation = window.confirm('Are you sure you want to delete this server?');
    confirmation && dispatch(deleteGuild(guild.id));
  }
  
  return (guild) ? (
    <ReactModal
      className="overflow-auto absolute bg-bg-primary h-full w-full outline-none"
      appElement={document.querySelector('#root')!}
      isOpen={openModal === GuildSettings.name}
      onRequestClose={() => dispatch(closedModal())}>
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-3 bg-bg-secondary">
          {/* TODO: add overview tab here */}
        </div>

        <div className="col-span-8 h-full">
          <form
            style={{height: '100%', padding: '60px 40px 80px'}}
            className="flex flex-col">
            <header>
              <h1 className="text-xl font-bold inline">Server Overview</h1>
            </header>
          
            <div className="flex-grow">
              <div className="pt-5">
                <label
                  htmlFor="name"
                  className="uppercase">Server Name</label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { value: guild.name })}
                  className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
              </div>

              <div className="pt-5">
                <label
                  htmlFor="iconURL"
                  className="uppercase">Icon URL</label>
                <input
                  id="iconURL"
                  type="text"
                  {...register('iconURL', { value: guild.iconURL })}
                  className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
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
    </ReactModal>
  ) : null;
}
 
export default GuildSettings;
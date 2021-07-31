import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../../store/guilds';
import { closedModal } from '../../store/ui';

const CreateChannel: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const openModal = useSelector((s: Store.AppStore) => s.ui.openModal);
  const guild = useSelector((s: Store.AppStore) => s.ui.activeGuild);

  const style: any = {
    overlay: {
      position: 'fixed',
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
  };

  const submitCreate = (data) => dispatch(createChannel(guild!.id, data.name));
  
  return (
    <ReactModal
      style={style}
      className="flex flex-col overflow-auto absolute bg-bg-primary w-1/4 inset-x-1/3 inset-y-1/3 rounded-lg outline-none"
      appElement={document.querySelector('#root')!}
      isOpen={openModal === CreateChannel.name}
      onRequestClose={() => dispatch(closedModal())}>
      <header className="text-center mb-5 p-5">
        <h1 className="text-2xl font-bold inline">Create Text Channel</h1>
      </header>

      <form
        className="flex-grow p-5"
        onSubmit={handleSubmit(submitCreate)}>
        <label
          htmlFor="name"
          className="uppercase">Channel Name</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
      </form>

      <footer
        style={{height: '70px'}}
        className="bg-bg-secondary flex-end">
        <button
          onClick={submitCreate}
          style={{height: '38px', padding: '2px 16px'}}
          className="float-right background bg-primary heading rounded-md m-4">Create</button>
      </footer>
    </ReactModal>
  );
}
 
export default CreateChannel;
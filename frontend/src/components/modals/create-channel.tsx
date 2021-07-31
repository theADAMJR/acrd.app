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
      className="overflow-auto absolute bg-bg-tertiary w-1/3 inset-x-1/3 inset-y-1/4 p-5 rounded-lg outline-none"
      appElement={document.querySelector('#root')!}
      isOpen={openModal === CreateChannel.name}
      onRequestClose={() => dispatch(closedModal())}>
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold inline">Create Text Channel</h1>
      </header>

      <h3 className="uppercase font-bold">Channel Name</h3>

      <form onSubmit={handleSubmit(submitCreate)}>
        <label
          htmlFor="name"
          className="uppercase">Name</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />

        <button className="background bg-primary heading w-full h-11 rounded-md mt-8">Create</button>
      </form>
    </ReactModal>
  );
}
 
export default CreateChannel;
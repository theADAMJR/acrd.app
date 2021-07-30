import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { createGuild, joinGuild } from '../../store/guilds';
import { closeModal } from '../../store/ui';

const CreateGuild: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const openModal = useSelector((s: Store.AppStore) => s.ui.openModal);

  const style: any = {
    overlay: {
      position: 'fixed',
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
  };

  const submitCreate = (data) => { dispatch(createGuild(data)); }
  const submitJoin = (data) => { dispatch(joinGuild(data)); }
  
  return (
    <ReactModal
      style={style}
      className="overflow-auto absolute bg-bg-tertiary w-1/3 inset-x-1/3 inset-y-1/4 p-5 rounded-lg outline-none"
      appElement={document.querySelector('#root')!}
      isOpen={openModal === CreateGuild.name}
      onRequestClose={() => dispatch(closeModal())}
    >
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold inline">Create Guild</h1>
        <p className="lead">
          Hang out with your friends. <br />
          Create your own, or join one.
        </p>
      </header>

      <form onSubmit={handleSubmit(submitJoin)}>
        <label
          htmlFor="inviteCode"
          className="uppercase">Invite Code</label>
        <input
          id="inviteCode"
          type="text"
          {...register('inviteCode')}
          className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />

        <button className="background bg-primary heading w-full h-11 rounded-md mt-8">Join</button>
      </form>

      <div className="mt-10" />
      <h3 className="uppercase font-bold">Make Your Own</h3>

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
 
export default CreateGuild;
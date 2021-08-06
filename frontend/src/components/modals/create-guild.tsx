import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createGuild, joinGuild } from '../../store/guilds';
import Modal from './modal';

const CreateGuild: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const submitCreate = (data) => dispatch(createGuild(data.name));
  const submitJoin = (data) => dispatch(joinGuild(data.inviteCode));
  
  return (
    <Modal
      className="p-5"
      type={CreateGuild}
      size="md">
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
    </Modal>
  );
}
 
export default CreateGuild;
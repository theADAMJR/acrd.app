import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createGuild, joinGuild } from '../../store/guilds';
import NormalButton from '../utils/buttons/normal-button';
import Input from '../utils/input';
import Modal from './modal';

const CreateGuild: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const { register: register2, handleSubmit: handleSubmit2 } = useForm();

  const submitCreate = (data) => dispatch(createGuild(data.name));
  const submitJoin = (data) => dispatch(joinGuild(data.inviteCode));
  
  return (
    <Modal
      className="p-5"
      type={CreateGuild}
      size="lg">
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold inline">Create Guild</h1>
        <p className="lead">
          Hang out with your friends. <br />
          Create your own, or join one.
        </p>
      </header>

      <form onSubmit={handleSubmit(submitJoin)}>
        <Input
          label="Invite Code"
          name="inviteCode"
          register={register} />
        <NormalButton className="w-full h-11 mt-8">Join</NormalButton>
      </form>

      <h3 className="uppercase font-bold mt-10">Make Your Own</h3>

      <form onSubmit={handleSubmit2(submitCreate)}>
        <Input
          label="Server Name"
          name="name"
          register={register2} />
        <NormalButton className="w-full h-11 mt-8">Create</NormalButton>
      </form>
    </Modal>
  );
}
 
export default CreateGuild;
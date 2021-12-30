import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createGuild } from '../../store/guilds';
import { joinGuild } from '../../store/members';
import NormalButton from '../utils/buttons/normal-button';
import Input from '../inputs/input';
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
      typeName={'CreateGuild'}
      size="lg">
      <header className="text-center mb-5">
        <h1 className="text-3xl font-bold inline">Create Guild</h1>
        <p className="lead">
          Hang out with your friends. <br />
          Create an epic guild, or join with friends.
        </p>
      </header>

      <h3 className="uppercase font-bold mt-10">Join Guild</h3>

      <form onSubmit={handleSubmit(submitJoin)}>
        <Input
          label="Invite Code"
          name="inviteCode"
          register={register} />
        <NormalButton className="bg-tertiary w-full h-11 mt-8">Join</NormalButton>
      </form>

      <h3 className="uppercase font-bold mt-10">Create Your Own</h3>

      <form onSubmit={handleSubmit2(submitCreate)}>
        <Input
          label="Guild Name"
          name="name"
          register={register2} />
        <NormalButton className="bg-primary font w-full h-11 mt-8">Create</NormalButton>
      </form>
    </Modal>
  );
}

export default CreateGuild;
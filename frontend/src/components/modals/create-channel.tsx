import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../../store/guilds';
import NormalButton from '../utils/buttons/normal-button';
import Input from '../utils/input';
import Modal from './modal';

const CreateChannel: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = useForm();
  const guild = useSelector((s: Store.AppStore) => s.ui.activeGuild);

  const create = (data) => {
    dispatch(createChannel(guild!.id, data.name));
    setValue('name', '');
  };
  
  return (
    <Modal type={CreateChannel}>
      <form
        className="flex flex-col h-full"
        onSubmit={handleSubmit(create)}>
        <header className="text-center mb-5 p-5">
          <h1 className="text-2xl font-bold inline">Create Text Channel</h1>
        </header>
      
        <div className="flex-grow p-5">
          <Input
            label="Channel Name"
            name="name"
            register={register} />
        </div>

        <footer className="bg-bg-secondary">
          <NormalButton
            className="float-right m-4">Create</NormalButton>
        </footer>
      </form>
    </Modal>
  );
}
 
export default CreateChannel;
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../../store/channels';
import NormalButton from '../utils/buttons/normal-button';
import Input from '../inputs/input';
import Modal from './modal';
import { ChannelTypes } from '@accord/types';

const CreateChannel: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = useForm();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild);

  const create = (data) => {
    dispatch(createChannel(guild!.id, data));
    setValue('name', '');
  };

  const types: ChannelTypes.Type[] = ['TEXT', 'VOICE'];
  
  return (
    <Modal typeName={'CreateChannel'} size="sm">
      <form
        className="flex flex-col h-full"
        onSubmit={handleSubmit(create)}>
        <header className="text-center mb-5 p-5">
          <h1 className="text-2xl font-bold inline">Create Channel</h1>
        </header>
      
        <div className="flex-grow p-5">
          <Input
            label="Channel Name"
            name="name"
            register={register} />
        </div>
      
      <div className="flex-grow pt-0 p-5">
        <label
          htmlFor="channelType"
          className="uppercase text-xs font-semibold">Channel Type</label>
        <select
          id="channelType"
          className="block bg-bg-secondary rounded focus:outline-none w-full h-10 p-2 mt-2"
          defaultValue={types[0]}
          {...register('type')}>
          {types.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

        <footer className="bg-bg-secondary">
          <NormalButton
            className="bg-primary font float-right m-4">Create</NormalButton>
        </footer>
      </form>
    </Modal>
  );
}
 
export default CreateChannel;
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createInvite } from '../../store/guilds';
import Input from '../utils/input';
import Modal from './modal';

const CreateInvite: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { register, setValue } = useForm();
  const { activeGuild, activeInvite, openModal } = useSelector((s: Store.AppStore) => s.ui);

  setValue('inviteCode', activeInvite?.id);

  const isOpen = openModal === CreateInvite.name;
  useEffect(() => {
    if (!isOpen) return;

    dispatch(createInvite(activeGuild!.id));
  }, [isOpen]);

  const copyCode = () => window.navigator.clipboard.writeText(activeInvite!.id);
  
  return (activeInvite) ? (
    <Modal type={CreateInvite} className="p-5">
      <header className="mb-3">
        <h1 className="font-bold inline uppercase">Invite Friends to {activeGuild?.name}</h1>
      </header>

      <h4 className="text-xs uppercase font-bold muted mb-3">Or Send A Server Invite To A Friend</h4>

      <div>
        <div className="relative">
          <button
            onClick={copyCode}
            className="background bg-primary heading px-3 h-8 rounded-sm top-9 right-1 absolute">Copy</button>
          <Input
            label="Invite Code"
            name="inviteCode"
            register={register}
            autoFocus />
        </div>
      </div>
    </Modal>
  ) : null;
}
 
export default CreateInvite;
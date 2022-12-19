import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../inputs/input';
import Modal from './modal';
import { createInvite } from '../../store/invites';
import CircleButton from '../utils/buttons/circle-button';

const CreateInvite: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { activeGuild, activeInvite, openModal } = useSelector((s: Store.AppState) => s.ui);
  const invites = useSelector((s: Store.AppState) => s.entities.invites.list);

  const isOpen = (openModal === 'CreateInvite');
  useEffect(() => {
    if (activeInvite || !activeGuild || !isOpen) return;

    dispatch(createInvite(activeGuild.id));
  }, [isOpen, invites]);

  const copyCode = () => {
    const inviteURL = `${process.env.PUBLIC_URL}/join/${activeInvite?.id}`;
    window.navigator.clipboard.writeText(inviteURL);
  }

  return (activeInvite) ? (
    <Modal typeName={'CreateInvite'} className="p-5">
      <header className="mb-3">
        <h1 className="font-bold inline uppercase">Invite Friends to {activeGuild?.name}</h1>
      </header>

      <div className="block bg-bg-tertiary rounded-lg p-2">
        <CircleButton
          style={{ color: 'var(--font)', borderColor: 'var(--font)' }}
          onClick={copyCode}
          className="float-right py-0">Copy</CircleButton>
        <span className="text-lg">
          <span className='muted'>{process.env.PUBLIC_URL || 'acrd.app/join/'}</span>
          <span className='primary'>{activeInvite?.id}</span>
        </span>
      </div>
    </Modal>
  ) : null;
}

export default CreateInvite;
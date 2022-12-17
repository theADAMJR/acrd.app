import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../store/ui';

const EscButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { closeSnackbar } = useSnackbar();

  const onClick = () => {
    dispatch(closeModal);
    closeSnackbar('saveChanges');
  };

  return (
    <div
      id="escButton"
      className="rounded-full border-2 border-muted cursor-pointer w-20 px-2.5 py-0.75 mt-14"
      onClick={onClick}>
      <FontAwesomeIcon icon={faTimes} color="var(--muted)" />
      <span className="pl-3 muted">ESC</span>
    </div>
  );
}

export default EscButton;
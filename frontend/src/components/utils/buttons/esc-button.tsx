import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../store/ui';

const EscButton = () => {
  const dispatch = useDispatch();
  const { closeSnackbar } = useSnackbar();

  const onClick = () => {
    dispatch(closeModal);
    closeSnackbar('saveChanges');
  };
  
  return (
    <div
      className="rounded-full ring ring-gray-500 cursor-pointer border-white rounded-full px-2 w-16 mt-14"
      onClick={onClick}>
      <FontAwesomeIcon icon={faTimes} color="var(--muted)" />
      <span className="pl-0.5 muted">ESC</span>
    </div>
  );
}

export default EscButton;
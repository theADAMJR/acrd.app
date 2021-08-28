import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../store/ui';

const EscButton = () => {
  const dispatch = useDispatch();
  const { closeSnackbar } = useSnackbar();
  
  return (
    <div
      className="cursor-pointer border-white rounded-full p-8 w-10"
      onClick={() => {
        dispatch(closeModal);
        closeSnackbar('saveChanges');
      } }>
      <FontAwesomeIcon icon={faTimes} />
      <span className="text-center block muted">ESC</span>
    </div>
  );
}

export default EscButton;
import ReactModal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux';
import { closedModal } from '../../store/ui';

export interface ModalProps {
  type: React.FunctionComponent;
  size?: keyof typeof sizeClass;
  className?: string;
}

const sizeClass = {
  'sm': 'rounded-lg w-1/4 inset-x-1/3 inset-y-1/3',
  'md': 'rounded-lg w-1/3 inset-x-1/3 inset-y-1/4',
  'lg': 'rounded-lg w-1/3 inset-x-1/3 top-1/4',
  'full': 'h-full w-full',
};
 
const Modal: React.FunctionComponent<ModalProps> = ({ className, type, size, children }) => {
  const dispatch = useDispatch();
  const openModal = useSelector((s: Store.AppStore) => s.ui.openModal);

  return (
    <ReactModal
      className={`bg-bg-primary overflow-auto fixed outline-none ${className} ${sizeClass[size ?? 'sm']}`}
      appElement={document.querySelector('#root')!}
      isOpen={openModal === type.name}
      onRequestClose={() => dispatch(closedModal())}>{children}</ReactModal>
  );
}
 
export default Modal;
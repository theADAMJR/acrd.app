import classNames from 'classnames';
import { useSnackbar } from 'notistack';
import ReactModal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../store/ui';

export interface ModalProps {
  typeName: string;
  size?: keyof typeof sizeClass;
  className?: string;
}

// TODO: add mobile styling support
const sizeClass = {
  'sm': 'rounded-lg 2xl:w-1/4 2xl:inset-x-1/3 2xl:inset-y-1/4   md:w-1/3 md:inset-x-1/3 md:inset-y-1/4',
  'md': 'rounded-lg 2xl:w-1/3 2xl:inset-x-1/3 2xl:inset-y-1/4   md:w-1/4 md:inset-x-1/3 md:inset-y-1/3',
  'lg': 'rounded-lg 2xl:w-1/3 2xl:inset-x-1/3 2xl:top-1/4       md:w-1/3 md:inset-x-1/3 md:top-20',
  'xl': 'rounded-lg 2xl:w-1/2 2xl:inset-x-1/4 2xl:top-1/4       md:w-1/3 md:inset-x-1/3 md:top-20',
  'full': 'h-full w-full',
};
 
const Modal: React.FunctionComponent<ModalProps> = ({ className, typeName, size, children }) => {
  const dispatch = useDispatch();
  const openModal = useSelector((s: Store.AppState) => s.ui.openModal);
  const { closeSnackbar } = useSnackbar();

  return (
    <ReactModal
      className={classNames(
        `bg-bg-primary overflow-auto fixed outline-none`,
        className,
        sizeClass[size ?? 'sm'],
      )}
      appElement={document.querySelector('#root') as any}
      isOpen={openModal === typeName}
      onRequestClose={() => {
        dispatch(closeModal);
        closeSnackbar('saveChanges');
      }}>{children}</ReactModal>
  );
}
 
export default Modal;
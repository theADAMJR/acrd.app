import ReactModal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux';
import { closedModal } from '../../store/ui';

export interface ModalProps {
  type: React.FunctionComponent;
}
 
const Modal: React.SFC<ModalProps> = (props) => {
  const dispatch = useDispatch();
  const openModal = useSelector((s: Store.AppStore) => s.ui.openModal);

  return (
    <ReactModal
      className="bg-bg-primary overflow-auto fixed w-1/4 inset-x-1/3 inset-y-1/3 rounded-lg outline-none"
      appElement={document.querySelector('#root')!}
      isOpen={openModal === props.type.name}
      onRequestClose={() => dispatch(closedModal())}
      {...props}>{props.children}</ReactModal>
  );
}
 
export default Modal;
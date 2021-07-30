import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../store/ui';

const CreateGuild: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const openModal = useSelector((s: Store.AppStore) => s.ui.openModal);
  
  return (
    <ReactModal
      className="bg-bg-tertiary w-1/2 flex self-center"
      isOpen={openModal === CreateGuild.name}
      onAfterClose={() => dispatch(closeModal())}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick>
      <h1>Create Guild</h1>
    </ReactModal>
  );
}
 
export default CreateGuild;
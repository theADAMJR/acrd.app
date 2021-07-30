import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../store/ui';

const CreateGuild: React.FunctionComponent = (props) => {
  const dispatch = useDispatch();
  const openModal = useSelector((s: Store.AppStore) => s.ui.openModal);

  const style: any = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  };
  
  return (
    <ReactModal
      style={style}
      className="bg-bg-tertiary w-1/2 flex self-center"
      appElement={document.querySelector('#root')!}
      isOpen={openModal === CreateGuild.name}
      onRequestClose={() => dispatch(closeModal())}>
      <h1>Create Guild</h1>
    </ReactModal>
  );
}
 
export default CreateGuild;
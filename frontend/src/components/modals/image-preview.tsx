import { useSelector } from 'react-redux';
import Modal from './modal';

const CreateInvite: React.FunctionComponent = () => {
  const resource = useSelector((s: Store.AppState) => s.ui.activeResource);
  
  return (resource) ? (
    <Modal typeName={'ImagePreview'} className="p-5">
      <img src={resource} />
      <a className="-mt-2" href={resource} target="_blank">View Original</a>
    </Modal>
  ) : null;
}
 
export default CreateInvite;
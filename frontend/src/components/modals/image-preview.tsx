import { useSelector } from 'react-redux';
import Modal from './modal';

const CreateInvite: React.FunctionComponent = () => {
  const resource = useSelector((s: Store.AppState) => s.ui.activeResource);
  const fullURL = process.env.REACT_APP_CDN_URL! + resource;

  return (resource) ? (
    <Modal
      size="lg"
      typeName={'ImagePreview'}
      className="p-5 bg-transparent ">
      <img
        src={fullURL}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `${process.env.REACT_APP_CDN_URL}/images/image-not-found.png`;
        }} />
      <a
        style={{ color: 'var(--normal)' }}
        className="pt-2"
        href={fullURL}
        target="_blank">View Original</a>
    </Modal>
  ) : null;
}
 
export default CreateInvite;
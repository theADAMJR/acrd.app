import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import Modal from './modal';

const UserProfile: FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.ui.activeUser);  
  return (user) ? (
    <Modal
      className="p-5"
      type={UserProfile}
      size="md">{user.username}</Modal>
  ) : null;
}
 
export default UserProfile;
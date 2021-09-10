import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import Username from '../user/username';
import Modal from './modal';

const UserProfile: FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.ui.activeUser); 
  
  
  return (user) ? (
    <Modal
      type={UserProfile}
      size="md">
      <header className="bg-bg-tertiary p-5">
        <Username avatarSize="lg" user={user} />
      </header>
      <main>main body</main>
    </Modal>
  ) : null;
}
 
export default UserProfile;
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

const UserProfile: FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.ui.activeUser);
  
return (user) ? (
    <div>{user.username}</div>
  ) : null;
}
 
export default UserProfile;
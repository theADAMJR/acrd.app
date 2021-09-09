import { FunctionComponent } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';

interface UserMenuProps {
  user: Entity.User;
}
 
const UserMenu: FunctionComponent<UserMenuProps> = ({ user }) => {
  return (
    <ContextMenu id={user.id}>
    </ContextMenu>
  );
}
 
export default UserMenu;
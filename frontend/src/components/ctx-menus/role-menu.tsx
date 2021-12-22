import { Entity } from '@accord/types';
import { ContextMenu } from 'react-contextmenu';
import { useSelector } from 'react-redux';
import DevModeMenuSection from './dev-mode-menu-section';

export interface RoleMenuProps {
  role: Entity.Role;
}

const RoleMenu: React.FunctionComponent<RoleMenuProps> = ({ role }) => {
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);

  return (
    <ContextMenu
      key={role.id}
      id={role.id}
      className="bg-bg-tertiary rounded shadow w-48 p-2">
      <div style={{ color: role.color }}>{role.name}</div>
      {devMode && <DevModeMenuSection ids={[
        { title: 'Role ID', id: role.id },
      ]} />}
    </ContextMenu>
  );
}
 
export default RoleMenu;
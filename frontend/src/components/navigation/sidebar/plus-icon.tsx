import { HTMLAttributes } from 'react';
import { useDispatch } from 'react-redux';
import { actions as ui } from '../../../store/ui';
import SidebarIcon from './sidebar-icon';

type PlusIconProps = HTMLAttributes<HTMLDivElement> & { disableHoverEffect?: boolean; };

const PlusIcon: React.FunctionComponent<PlusIconProps> = (props) => {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => dispatch(ui.openedModal('CreateGuild'))}
      className="success text-3xl"
      {...props}>
      <SidebarIcon
        childClasses="success"
        disableHoverEffect={props.disableHoverEffect}
        name="+" />
    </div>
  );
}
export default PlusIcon;
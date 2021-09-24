import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { angrySaveChanges } from '../../store/ui';

export interface TabLinkProps {
  tab: string;
  id: string;
  setTab?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}
type Props = React.HTMLAttributes<HTMLAnchorElement>;
 
const TabLink: React.FunctionComponent<TabLinkProps & Props> = (props) => {
  const { id, tab, setTab, children, className } = props;
  const saveChangesOpen = useSelector((s: Store.AppState) => s.ui.saveChangesOpen);

  return (
    <Link
      {...props}
      to="#"
      onClick={() => {
        if (saveChangesOpen)
          return angrySaveChanges();
        setTab?.(id);
      }}
      className={classNames(
        `flex items-center rounded py-1.5 px-2.5 h-8 mb-0.5`,
        className,
        { 'active': tab === id })}>{children}</Link>
  );
}
 
export default TabLink;
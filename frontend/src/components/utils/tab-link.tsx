import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { angrySaveChanges } from '../../store/ui';

export interface TabLinkProps {
  tab: string;
  setTab?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}
 
const TabLink: React.FunctionComponent<TabLinkProps> = ({ tab, setTab, children, className }) => {
  const saveChangesOpen = useSelector((s: Store.AppState) => s.ui.saveChangesOpen);
  const name = children?.toString() ?? '';

  return (
    <Link
      to="#"
      onClick={() => {
        if (saveChangesOpen)
          return angrySaveChanges();
        setTab?.(name.toLowerCase());
      }}
      className={`
        flex items-center rounded py-1.5 px-2.5 h-8 mb-0.5 ${className}
        ${tab === name.toLowerCase() && 'active'}`}>{name}</Link>
  );
}
 
export default TabLink;
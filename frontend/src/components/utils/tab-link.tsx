import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { angrySaveChanges } from '../../store/ui';

export interface TabLinkProps {
  tab: string;
  id: string;
  setTab?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}
 
const TabLink: React.FunctionComponent<TabLinkProps> = ({ id, tab, setTab, className, children }) => {
  const saveChangesOpen = useSelector((s: Store.AppState) => s.ui.saveChangesOpen);

  return (
    <Link
      to="#"
      onClick={() => {
        if (saveChangesOpen)
          return angrySaveChanges();
        setTab?.(id);
      }}
      className={`
        flex items-center rounded py-1.5 px-2.5 h-8 mb-0.5 ${className}
        ${tab === id && 'active'}`}>{children}</Link>
  );
}
 
export default TabLink;
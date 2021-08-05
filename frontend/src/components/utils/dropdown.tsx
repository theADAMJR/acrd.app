import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

export interface DropdownProps {
  title: string;
  type: React.FunctionComponent;
}

const Dropdown: React.FunctionComponent<DropdownProps> = (props) => {
  const dropdown = useSelector((s: Store.AppStore) => s.ui.openDropdown);
  
  return (
    <div className="w-full pt-3">
      <div className="flex justify-between items-center">
        <h1 className="flex-grow font-bold pl-2">{props.title}</h1>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      <div className="absolute hidden bg-bg-floating rounded w-56 p-2">
        {(dropdown === props.type.name) && props.children}
      </div>
    </div>
  );
}
 
export default Dropdown;
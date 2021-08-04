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
    <div className="dropdown inline-block relative">
      <div className="flex justify-content-between flex items-center">
        <h1 className="flex-grow font-bold pl-2">{props.title}</h1>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      <div className="dropdown-menu absolute hidden bg-bg-floating rounded w-56 p-2">
        {(dropdown === props.type.name) && props.children}
      </div>
    </div>
  );
}
 
export default Dropdown;
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

export interface DropdownProps {
  title: string;
  type: React.FunctionComponent;
}

const Dropdown: React.FunctionComponent<DropdownProps> = (props) => {
  const dropdown = useSelector((s: Store.AppState) => s.ui.openDropdown);

  return (
    <div className="w-full pt-3">
      <div className="flex justify-between items-center">
        <h1 className="flex-grow font-bold pl-2">{props.title}</h1>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      {
        (dropdown === props.type.name) && 
        <div className="absolute bg-bg-floating rounded w-56 p-2 mt-5 z-10">
          {props.children}
        </div>
      }
    </div>
  );
}
 
export default Dropdown;
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './dropdown.scoped.css';

export interface DropdownProps {
  title: string;
}

const Dropdown: React.FunctionComponent<DropdownProps> = (props) => {
  return (
    <div className="dropdown inline-block relative">
      <div className="flex justify-content-between flex items-center">
          <h1 className="flex-grow font-bold pl-2">{props.title}</h1>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      <ul className="dropdown-menu absolute hidden text-gray-700 pt-1 bg-bg-floating">
        {props.children}
      </ul>
    </div>
  );
}
 
export default Dropdown;
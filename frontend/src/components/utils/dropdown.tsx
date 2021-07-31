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
      <div className="dropdown-menu absolute hidden p-2 bg-bg-floating rounded">
        {props.children}
      </div>
    </div>
  );
}
 
export default Dropdown;
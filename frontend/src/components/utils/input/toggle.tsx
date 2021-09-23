import classNames from 'classnames';
import { useState } from 'react';
import './toggle.scoped.css';

export type ToggleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLInputElement>,
  HTMLInputElement> & {
  checked: boolean;
  allowIndeterminate?: boolean;
  indeterminate?: boolean;
  id: string;
}
 
const Toggle: React.FunctionComponent<ToggleProps> = (props) => {  
  const [prevState, setPrevState] = useState(props.indeterminate ? null : props.checked);
  
  const onInput = () => {
    if (!props.allowIndeterminate) return;

    const checkbox = document.querySelector(`#${props.id}`) as HTMLInputElement;
    checkbox.indeterminate = prevState !== null;
    setPrevState(checkbox.indeterminate ? null : checkbox.checked);

    // cancel effect of checked
    if (checkbox.indeterminate)
      checkbox.checked = !checkbox.checked;
  };

  return (
    <div className={classNames(`flex`, props.className)}>
      <label
        htmlFor={props.id}
        className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            {...props}
            id={props.id}
            type="checkbox"
            className="sr-only"
            checked={props.checked}
            onInput={onInput} />
          <div className="block bg-gray-600 w-14 h-8 rounded-full" />
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
        </div>
      </label>
    </div>
  );
}
 
export default Toggle;
import './three-toggle.scoped.css';
import classNames from 'classnames';
import { FormEvent, useEffect, useState } from 'react';

export type ThreeToggleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLInputElement>,
  HTMLInputElement> & {
  id: string;
  defaultValue: 'on' | 'n/a' | 'off';
  onChange: (e: FormEvent<HTMLInputElement>) => any;
}
 
const ThreeToggle: React.FunctionComponent<ThreeToggleProps> = (props) => {  
  // default value and current value is one behind
  const [value, setValue] = useState(props.defaultValue);

  const onClick = ({ currentTarget }) => setValue({
    'on': 'off',
    'n/a': 'on',
    'off': 'n/a',
  }[currentTarget.value]);
  
  return (
    <div className={classNames(`flex`, props.className)}>
      <label
        htmlFor={props.id}
        className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            id={props.id}
            onChange={props.onChange}
            onClick={onClick}
            value={value}
            type="checkbox"
            className="sr-only" />
          <div className="block bg-gray-600 w-14 h-8 rounded-full" />
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
        </div>
      </label>
    </div>
  );
}
 
export default ThreeToggle;
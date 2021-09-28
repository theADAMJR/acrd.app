import './three-toggle.scoped.css';

import classNames from 'classnames';
import { useEffect } from 'react';

export type ThreeToggleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLInputElement>,
  HTMLInputElement> & {
  id: string;
  initialValue: 'on' | 'off' | 'indeterminate';
}
 
const ThreeToggle: React.FunctionComponent<ThreeToggleProps> = (props) => {
  useEffect(() => {
    const checkbox = document.querySelector(`#${props.id}`)!;
    checkbox.setAttribute('value', props.initialValue);
  }, []);
  
  return (
    <div className={classNames(`flex`, props.className)}>
      <label
        htmlFor={props.id}
        className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            {...props}
            id={props.id}
            onClick={({ currentTarget: checkbox }) => {
              if (checkbox.value === 'on')
                checkbox.setAttribute('value', 'indeterminate');
              else if (checkbox.value === 'off')
                checkbox.setAttribute('value', 'on');
              else checkbox.setAttribute('value', 'off');
            }}
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
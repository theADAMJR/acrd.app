import './three-toggle.scoped.css';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { filterProps } from '../react/react-shush-error';

export type ThreeToggleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLInputElement>,
  HTMLInputElement> & {
  id: string;
  defaultValue: 'on' | 'n/a' | 'off';
}
 
const ThreeToggle: React.FunctionComponent<ThreeToggleProps> = (props) => {
  const onClick = ({ currentTarget }) => currentTarget.value = {
    'on': 'n/a',
    'n/a': 'off',
    'off': 'on',
  }[currentTarget.value];
  
  return (
    <div className={classNames(`flex`, props.className)}>
      <label
        htmlFor={props.id}
        className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            {...filterProps(props)}
            id={props.id}
            defaultValue={props.defaultValue}
            onClick={onClick}
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
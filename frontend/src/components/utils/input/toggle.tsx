import { useState } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import './toggle.scoped.css';

export interface ToggleProps {
  checked: boolean;
  name: string;
  register: UseFormRegister<FieldValues>;
  className?: string;
}
 
const Toggle: React.FunctionComponent<ToggleProps> = (props) => {
  const [checked, setChecked] = useState(props.checked);

  return (
    <div className={`flex ${props.className}`}>
      <label htmlFor={props.name} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            id={props.name}
            type="checkbox"
            className="sr-only"
            checked={checked}
            onClick={() => setChecked(!checked)}
            {...props.register(props.name)}/>
          <div className="block bg-gray-600 w-14 h-8 rounded-full" />
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
        </div>
      </label>
    </div>
  );
}
 
export default Toggle;
import { UseFormRegister, FieldValues } from 'react-hook-form';

import './input.scoped.css';

export interface InputProps {
  label?: string;
  type?: string;
  name: string;
  register: UseFormRegister<FieldValues>;
  options?: any;
}
 
const Input: React.SFC<InputProps> = ({ label, name, register, options, type }) => {
  return (
    <>
      {label &&
        <label
          htmlFor={name}
          className="uppercase text-xs font-semibold">{label}</label>}
      <input
        id={name}
        type={type ?? 'text'}
        required 
        {...register(name, { required: true, ...options })}
        className="block bg-bg-secondary rounded focus:outline-none w-full h-10 p-2 mt-2" />
    </>
  );
}
 
export default Input;
import { UseFormRegister, FieldValues } from 'react-hook-form';

export interface InputProps {
  label?: string;
  name: string;
  register: UseFormRegister<FieldValues>;
}
 
const Input: React.SFC<InputProps> = ({ label, name, register }) => {
  return (
    <>
      {label &&
        <label
          htmlFor={name}
          className="uppercase">{label}</label>}
      <input
        id={name}
        type="text"
        {...register(name)}
        className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
    </>
  );
}
 
export default Input;
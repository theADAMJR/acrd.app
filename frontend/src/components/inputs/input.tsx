import './input.scoped.css';
import classNames from 'classnames';
import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { filterProps } from '../utils/react/react-shush-error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';

export interface InputProps {
  name: string;
  register?: UseFormRegister<FieldValues>;
  options?: any;
  autoFocus?: boolean;
  label?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
}
 
const Input: React.FunctionComponent<InputProps & React.AllHTMLAttributes<HTMLInputElement>> = (props) => {
  const { label, name, register, options, type, autoFocus, className, disabled, tooltip } = props;
  const id = name + 'Input';

  return (
    <div className={className}>
      {label && (<>
        <label
          htmlFor={id}
          className="uppercase text-xs font-semibold">{label}</label>
        {tooltip && (<>
          <FontAwesomeIcon
            data-tip
            data-for={id + 'Tooltip'}
            size="sm"
            style={{ color: "var(--muted)" }}
            className="cursor-pointer ml-2"
            icon={faQuestionCircle} />
          <ReactTooltip id={id + 'Tooltip'} effect="solid" backgroundColor="var(--bg-tertiary)">
            <span>{tooltip}</span>
          </ReactTooltip>
        </>)}
      </>)}
      <input
        id={id}
        type={type ?? 'text'}
        autoFocus={autoFocus}
        disabled={disabled}
        {...filterProps(props)}
        {...register?.(name, { ...options })}
        className={classNames(
          'block bg-bg-secondary rounded focus:outline-none w-full h-10 p-2 mt-2',
          { 'h-12': type === 'file' },
        )} />
    </div>
  );
}
 
export default Input;
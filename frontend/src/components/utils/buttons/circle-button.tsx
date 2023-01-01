import classNames from 'classnames';
import { HTMLAttributes } from 'react';

const CircleButton: React.FunctionComponent<HTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      className={classNames(
        `rounded-full border-2 border-gray-400 secondary px-4 py-1`,
        props.className)}>{props.children}</button>
  );
}

export default CircleButton;
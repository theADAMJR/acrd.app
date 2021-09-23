import classNames from 'classnames';

const CircleButton: React.FunctionComponent<any> = (props) => {
  return (
    <button
      {...props}
      className={classNames(
        `rounded-full ring ring-gray-400 secondary px-4 py-1`,
        props.className)}>{props.children}</button>
  );
}
 
export default CircleButton;
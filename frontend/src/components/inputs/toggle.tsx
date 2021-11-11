import './toggle.scoped.css';
import classNames from 'classnames';

export type ToggleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLInputElement>,
  HTMLInputElement> & {
  checked: boolean;
  id: string;
}
 
const Toggle: React.FunctionComponent<ToggleProps> = (props) => {
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
            checked={props.checked} />
          <div className="block bg-gray-600 w-14 h-8 rounded-full" />
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
        </div>
      </label>
    </div>
  );
}
 
export default Toggle;
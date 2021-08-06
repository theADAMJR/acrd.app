const CircleButton: React.FunctionComponent<any> = (props) => {
  return (
    <button className="rounded-full ring ring-gray-400 secondary px-4 py-1">{props.children}</button>
  );
}
 
export default CircleButton;
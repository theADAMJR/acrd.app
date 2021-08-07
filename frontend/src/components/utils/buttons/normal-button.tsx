const NormalButton: React.FunctionComponent<any> = (props) => {
  return (
    <button
      {...props}
      className={`bg-primary heading rounded-md py-1.5 px-4 ${props.className}`}>
      {props.children}
    </button>
  );
}
 
export default NormalButton;
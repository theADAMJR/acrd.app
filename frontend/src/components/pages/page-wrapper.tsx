import WSListener from '../ws-listener';

export type PageWrapperProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const PageWrapper: React.FunctionComponent<PageWrapperProps> = (props) => {
  return (
    <div {...props}>
      {props.children}
      <WSListener />
    </div>
  );
}
 
export default PageWrapper;
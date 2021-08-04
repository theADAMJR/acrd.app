export interface CategoryProps {
  title: string;
  count?: number;
}
 
const Category: React.FunctionComponent<CategoryProps> = (props) => {
  return (
    <h2
      style={{
        padding: '24px 8px 0 16px',
        height: '40px',
      }}
      className="uppercase font-bold text-xs tracking-wider">
      {props.title} {props.count !== undefined && `— ${props.count}`}
    </h2>
  );
}
 
export default Category;
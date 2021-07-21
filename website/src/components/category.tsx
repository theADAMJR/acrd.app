import './category.css';

export interface CategoryProps {
  title: string;
  count?: number;
}
 
const Category: React.FunctionComponent<CategoryProps> = (props) => {
  return (
    <h2 className="category uppercase font-bold text-xs tracking-wider">
      {props.title} {props.count !== undefined && `— ${props.count}`}
    </h2>
  );
}
 
export default Category;
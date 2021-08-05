export interface CategoryProps {
  title: string;
  count?: number;
}
 
const Category: React.FunctionComponent<CategoryProps> = ({ title, count }) => {
  return (
    <h2 className="uppercase font-bold text-xs tracking-wider pt-6 pr-2 pl-4 h-10">
      {title} {count !== undefined && `— ${count}`}
    </h2>
  );
}
 
export default Category;
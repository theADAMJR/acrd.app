import classNames from 'classnames';

export interface CategoryProps {
  title: string;
  count?: number;
  className?: string;
}

const Category: React.FunctionComponent<CategoryProps> = ({ title, count, className }) => {
  return (
    <h2 className={classNames(`uppercase font-bold text-xs tracking-wider`, className)}>
      {title} {count !== undefined && `— ${count}`}
    </h2>
  );
}

export default Category;
import { Link } from 'react-router-dom';

const NotFoundPage: React.FunctionComponent = () => {
  return (
    <header className="items-center text-center">
      <h1 className="text-4xl">Not Found</h1>
      <button><Link to="/">Return Home</Link></button>
    </header>
  );
}
 
export default NotFoundPage;
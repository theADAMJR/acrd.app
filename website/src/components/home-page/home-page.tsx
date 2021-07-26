import { Link } from 'react-router-dom';

const HomePage: React.FunctionComponent = () => {
  return (
    <nav className="navbar d-inline">
      <a className="logo">
        <span className="text-bold text-black">DCLONE</span>
        <span className="text-muted mx-1">|</span>
        <span className="text-thin">ESSENTIAL</span>
      </a>

      <div className="d-inline float-right mr-2">
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
 
export default HomePage;
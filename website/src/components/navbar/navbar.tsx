import { Link } from 'react-router-dom';
import './navbar.scoped.css';
 
const Navbar: React.FunctionComponent = () => {
  return (
    <nav className="flex justify-between p-4">
      <a className="logo">
        <span className="font-bold text-white">DCLONE</span>
        <span className="text-gray-600 mx-1">|</span>
        <span className="text-muted font-light">ESSENTIAL</span>
      </a>
      <div>
        <button className="rounded-full ring ring-gray-400 px-4 py-1">
          <Link to="/login">Login</Link>
        </button>
      </div>
    </nav>
  );
}
 
export default Navbar;
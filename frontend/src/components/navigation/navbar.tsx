import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './navbar.scoped.css';
 
const Navbar: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppStore) => s.auth.user);
  
  return (
    <nav className="flex justify-between p-4">
      <a className="logo">
        <span className="font-bold text-white">DCLONE</span>
        <span className="text-gray-600 mx-1">|</span>
        <span className="text-muted font-light">ESSENTIAL</span>
      </a>
      <div>
        <button className="rounded-full ring ring-gray-400 px-4 py-1">
          {!user && <Link to="/login">Login</Link>}
          {user && <Link to="/channels/@me">App</Link>}
        </button>
      </div>
    </nav>
  );
}
 
export default Navbar;
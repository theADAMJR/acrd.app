import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CircleButton from '../utils/buttons/circle-button';
 
const Navbar: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.auth.user);
  
  return (
    <nav className="flex items-center justify-between h-15 p-4 px-8">
      <a className="logo">
        <span className="font-bold text-white">accord</span>
        <span className="text-gray-600">.</span>
        <span className="muted font-light">app</span>
      </a>
      <div>
        <Link to={user ? '/channels/@me' : '/login'}>
          <CircleButton>{user ? 'App' : 'Login'}</CircleButton>
        </Link>
      </div>
    </nav>
  );
}
 
export default Navbar;
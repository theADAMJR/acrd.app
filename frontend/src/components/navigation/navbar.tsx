import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CircleButton from '../utils/buttons/circle-button';

const Navbar: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.auth.user);

  return (
    <nav className="flex items-center justify-between h-15 p-4 px-8">
      <a className="logo">
        <span className="font-bold heading">acrd</span>
        <span className="normal">.</span>
        <span className="muted secondary">app</span>
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
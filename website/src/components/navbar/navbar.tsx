import { Link } from 'react-router-dom';
 
const Navbar: React.FunctionComponent = () => {
  return (
    <nav className="mx-2 navbar d-inline">
      <a className="logo">
        <span className="text-bold text-black">DCLONE</span>
        <span className="text-muted mx-1">|</span>
        <span className="text-thin">ESSENTIAL</span>
      </a>
      <div className="d-inline float-right">
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
 
export default Navbar;
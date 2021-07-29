import { Link } from 'react-router-dom';
import Particles from 'react-particles-js';

const LoginPage: React.FunctionComponent = () => {
  const style: any = {position: 'absolute', left: '35%'}!;
  return (
    <>
      <div style={style} className="flex items-center justify-center h-screen">
        <form style={{width: '450px'}} className="rounded-md shadow bg-bg-secondary p-8">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="lead">We're so excited to see you again!</p>

          <div className="form-group mt-3">
            <label htmlFor="username" className="uppercase">Username</label>
            {/* make inputs own components? */}
            <input
              id="username"
              type="text"
              className="block w-full h-10" />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="password" className="uppercase">Password</label>
            <input
              id="password"
              type="password"
              className="block w-full h-10" />
          </div>

          <button className="background bg-primary heading w-full h-11 rounded-md mt-8">Login</button>
          <p className="mt-2">Need an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
      <Particles width="100%" height="100%" />
    </>
  );
}
 
export default LoginPage;
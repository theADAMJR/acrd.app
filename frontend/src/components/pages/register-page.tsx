import Particles from 'react-particles-js';
import { Link } from 'react-router-dom';

const RegisterPage: React.FunctionComponent = () => {
  const style: any = {position: 'absolute', left: '35%'}!;
  return (
    <>
      <div
        style={style}
        className="flex items-center justify-center h-screen">
        <form
          style={{ width: '480px' }}
          className="rounded-md shadow bg-bg-primary p-8">
          <h1 className="text-2xl font-bold mb-8 text-center">Create an account</h1>

          <div className="form-group mt-3">
            <label htmlFor="username" className="uppercase">Username</label>
            <input
              id="username"
              type="text"
              className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="password" className="uppercase">Password</label>
            <input
              id="password"
              type="password"
              className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="password" className="uppercase">Confirm Password</label>
            <input
              id="password"
              type="password"
              className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
          </div>

          <button className="background bg-primary heading w-full h-11 rounded-md mt-8">Register</button>
          <p className="mt-2"><Link to="/login">Already have an account?</Link></p>
        </form>
      </div>
      <Particles width="100%" height="100%" />
    </>
  );
}
 
export default RegisterPage;
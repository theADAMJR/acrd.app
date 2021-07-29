import Particles from 'react-particles-js';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../store/auth';
import { useDispatch } from 'react-redux';

const RegisterPage: React.FunctionComponent = () => {  
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const onSubmit = (credentials) => dispatch(registerUser(credentials));

  return (
    <>
      <div
        style={{position: 'absolute', left: '35%'}}
        className="flex items-center justify-center h-screen">
        <form
          style={{ width: '480px' }}
          className="rounded-md shadow bg-bg-primary p-8"
          onSubmit={e => { e.preventDefault(); handleSubmit(onSubmit) }}>
          <h1 className="text-2xl font-bold mb-8 text-center">Create an account</h1>

          <div className="form-group mt-3">
            <label htmlFor="username" className="uppercase">Username</label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="password" className="uppercase">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="confirmPassword" className="uppercase">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
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
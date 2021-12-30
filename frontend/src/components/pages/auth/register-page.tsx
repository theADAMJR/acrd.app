import Particles from 'react-particles-js';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from '../../../store/auth';
import NormalButton from '../../utils/buttons/normal-button';
import PageWrapper from '../page-wrapper';
import Input from '../../inputs/input';
import { useState } from 'react';
import FullParticles from '../../utils/full-particles';

const RegisterPage: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const query = new URLSearchParams(useLocation().search);
  const [email, setEmail] = useState(query.get('email') ?? '');

  const onSubmit = (data) => dispatch(registerUser(data));

  return (user)
    ? <Redirect to="/channels/@me" />
    : (
      <PageWrapper>
        <div className="flex items-center justify-center absolute top-[30%] left-[35%]">
          <form className="rounded-md shadow bg-bg-primary p-8 w-[480px]"
            onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-bold mb-8 text-center">Create an account</h1>

            <Input
              label="Email"
              name="email"
              register={register}
              className="mt-3"
              defaultValue={email!}
              onInput={(e) => setEmail(e.currentTarget.value)} />
            <Input
              label="Username"
              name="username"
              register={register}
              className="mt-3" />
            <Input
              label="Password"
              name="password"
              type="password"
              register={register}
              className="mt-3" />

            <NormalButton className="bg-primary font w-full h-11 rounded-md mt-8">Register</NormalButton>
            <p className="mt-2">
              <Link to={`/login${email && `?email=${email}`}`}>Already have an account?</Link>
            </p>
          </form>
        </div>
        <FullParticles />
      </PageWrapper>
    );
}

export default RegisterPage;
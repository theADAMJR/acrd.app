import { Link, Redirect, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../page-wrapper';
import Input from '../../inputs/input';
import NormalButton from '../../utils/buttons/normal-button';
import { loginUser, forgotPasswordEmail } from '../../../store/auth';
import { useState } from 'react';
import VerifyCodeInput from './verify-code-input';
import FullParticles from '../../utils/full-particles';

const LoginPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, getValues } = useForm();
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const shouldVerify = useSelector((s: Store.AppState) => s.auth.shouldVerify);
  const query = new URLSearchParams(useLocation().search);
  const [email, setEmail] = useState(query.get('email') ?? '');

  const onLogin = (data) => dispatch(loginUser(data));
  const resetPassword = () => dispatch(forgotPasswordEmail(getValues().email));

  return (user)
    ? <Redirect to="/channels/@me" />
    : (
      <PageWrapper pageTitle="accord.app | Login">
        <div className="flex items-center absolute justify-center top-[30%] left-[35%]">
          <form
            className="rounded-md shadow bg-bg-primary p-8 w-[478px]"
            onSubmit={handleSubmit(onLogin)}>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="lead">We're so excited to see you again!</p>

            <Input
              label="Email"
              name="email"
              register={register}
              className="mt-3"
              defaultValue={email!}
              onInput={(e) => setEmail(e.currentTarget.value)} />
            <Input
              label="Password"
              name="password"
              type="password"
              register={register}
              className="mt-3" />
            <Link to="#" onClick={resetPassword}>Forgot your password?</Link>

            {shouldVerify && <VerifyCodeInput />}

            <NormalButton className="bg-primary font w-full h-11 rounded-md mt-8">
              {(shouldVerify) ? 'Resend Code' : 'Login'}
            </NormalButton>
            <p className="mt-2">Need an account? <Link to={`/register${email && `?email=${email}`}`}>Register</Link></p>
          </form>
        </div>
        <FullParticles />
      </PageWrapper>
    );
}

export default LoginPage;
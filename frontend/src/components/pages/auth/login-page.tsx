import './login-page.scoped.css';

import { Link, Redirect } from 'react-router-dom';
import Particles from 'react-particles-js';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PageWrapper from '../page-wrapper';
import Input from '../../utils/input/input';
import NormalButton from '../../utils/buttons/normal-button';
import { loginUser, forgotPasswordEmail, verifyCode } from '../../../store/auth';
import { useState } from 'react';

const LoginPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, getValues } = useForm();
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const { enqueueSnackbar } = useSnackbar();
  const shouldVerify = useSelector((s: Store.AppState) => s.auth.shouldVerify);

  const VerifyCodeInput = () => {
    const verifyForm = useForm();
    const onVerify = () => dispatch(verifyCode(verifyForm.getValues().code));
    
    return (
      <div>
        <hr className="border-gray-500 my-4" />
        <div className="flex items-end">
          <Input
            type="text" 
            name="code"
            label="Verify Code"
            className="w-full mr-2"
            register={verifyForm.register} />
          <NormalButton
            type="button"
            onClick={onVerify}
            className="bg-success text-black h-10">Verify</NormalButton>
        </div>
      </div>
    );
  }

  const onLogin = (data) => dispatch(loginUser(data));
  const resetPassword = () => {
    dispatch(forgotPasswordEmail(getValues().email));

    enqueueSnackbar('Reset password instructions sent to email.', {
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      key: 'saveChanges',
      variant: 'info',
    });
  }

  return (user)
    ? <Redirect to="/channels/@me" />
    : (
      <PageWrapper pageTitle="accord.app | Login">
        <div className="flex items-center absolute justify-center h-screen">
          <form
            className="rounded-md shadow bg-bg-primary p-8"
            onSubmit={handleSubmit(onLogin)}>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="lead">We're so excited to see you again!</p>

            <Input
              label="Email"
              name="email"
              register={register}
              className="mt-3" />
            <Input
              label="Password"
              name="password"
              type="password"
              register={register}
              className="mt-3" />
            <Link to="#" onClick={resetPassword}>Forgot your password?</Link>

            {shouldVerify && <VerifyCodeInput />}

            <NormalButton className="w-full h-11 rounded-md mt-8">Login</NormalButton>
            <p className="mt-2">Need an account? <Link to="/register">Register</Link></p>
          </form>
        </div>
        <Particles width="100%" height="100%" />
      </PageWrapper>
    );
}

export default LoginPage;
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { sendVerifyCode } from '../../../store/auth';
import LoadingPage from '../loading-page';

const VerifyPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const code = query.get('code')?.toString();
  
  useEffect(() => {
    if (code)
      dispatch(sendVerifyCode(code));
  }, []);

  return (code) ? <LoadingPage /> : <Redirect to="/" />;
}
 
export default VerifyPage;
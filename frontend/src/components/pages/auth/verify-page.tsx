import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { verifyCode } from '../../../store/auth';
import LoadingPage from '../loading-page';

const VerifyPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const code = query.get('code')?.toString();
  
  useEffect(() => {
    if (code)
      dispatch(verifyCode(code));
  }, []);

  return (code) ? <LoadingPage /> : <Redirect to="/" />;
}
 
export default VerifyPage;
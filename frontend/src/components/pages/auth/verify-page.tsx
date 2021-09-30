import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { sendVerifyCode } from '../../../store/auth';
import LoadingPage from '../loading-page';

const VerifyPage: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const code = query.get('code')?.toString();
  
  useEffect(() => {
    if (code)
      dispatch(sendVerifyCode(code));
  }, []);

  if (user) return <Redirect to="/channels/@me" />;
  if (code) return <LoadingPage />;

  return <Redirect to="/" />;
}
 
export default VerifyPage;
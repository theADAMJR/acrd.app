import { useSelector } from 'react-redux';

const OverviewPage: React.FunctionComponent = () => {
  const user = useSelector((s: Store.AppStore) => s.auth.user);
  
  return (
    <>
      <h1>Welcome to the dashboard!</h1>
      <strong>{JSON.stringify(user)}</strong>
    </>
  );
}
 
export default OverviewPage;
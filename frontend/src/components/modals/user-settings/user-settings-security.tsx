import { faCheckCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../../store/auth';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Input from '../../inputs/input';

const UserSettingsSecurity: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const passwordForm = useForm();
  const user = useSelector((s: Store.AppState) => s.auth.user)!;

  const onChangePassword = (e) => {
    const { oldPassword, newPassword } = passwordForm.getValues();
    const onUpdate = () => dispatch(changePassword(oldPassword, newPassword));
    passwordForm.handleSubmit(onUpdate)(e);
  };

  return (
    <div className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Account Security</h1>
      </header>

      <Category
        className="py-2 mt-5"
        title="Change Password" />

      <section className="w-1/2">
        {!user.verified && <div className="secondary">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span className="ml-1">To change your password, your email must be verified.</span>
        </div>}

        <div className="mt-5" />

        <Input
          label="Old Password"
          name="oldPassword"
          type="password"
          register={passwordForm.register} />

        <Input
          label="New Password"
          name="newPassword"
          type="password"
          className="pt-5"
          register={passwordForm.register} />

        <div className="flex justify-center w-full mt-4">
          <NormalButton
            onClick={passwordForm.handleSubmit(onChangePassword)}
            className="bg-warning">Change</NormalButton>
        </div>
      </section>

      <section className="mt-10">
        <Category title="Login Status" className="pb-2" />

        {(user.verified)
          ? <div className="success">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
              <span>Your email is verified and email 2FA is enabled.</span>
            </div>
          : <div className="warning">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
              <span>Your email is unverified which means that email 2FA is unavailable.</span>
            </div>}
      </section>
    </div>    
  );
}
 
export default UserSettingsSecurity;
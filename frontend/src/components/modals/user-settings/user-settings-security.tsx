import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../../store/auth';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Input from '../../utils/input/input';

const UserSettingsSecurity: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const passwordForm = useForm();

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

      <section className="w-1/3">
        <div className="secondary">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span className="ml-1">Your email must be verified to be able to change the password.</span>
        </div>

        <div className="pt-5">
          <Input
            label="Old Password"
            name="oldPassword"
            type="password"
            register={passwordForm.register} />
        </div>

        <div className="pt-5">
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            register={passwordForm.register} />
        </div>

      <div className="flex justify-center w-full mt-4">
        <NormalButton
          onClick={passwordForm.handleSubmit(onChangePassword)}
          className="bg-warning">Change</NormalButton>
        </div>
      </section>
    </div>    
  );
}
 
export default UserSettingsSecurity;
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { openSaveChanges } from '../../../store/ui';
import { updateSelf, deleteSelf } from '../../../store/users';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Input from '../../utils/input/input';
import SaveChanges from '../../utils/save-changes';

const UserSettingsSecurity: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppState) => s.auth.user)!;
  const passwordForm = useForm();

  const onChangePassword = (e) => {
    const onUpdate = (payload) => dispatch(updateSelf(payload));
    passwordForm.handleSubmit(onUpdate)(e);
  };

  return (
    <form
      onChange={() => dispatch(openSaveChanges(true))}
      className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Account Security</h1>
      </header>

      <Category
        className="py-2 mt-5"
        title="Change Password" />

      <section className="w-1/3">
        <div className="pt-5">
          <Input
            label="Old Password"
            name="oldPassword"
            register={passwordForm.register} />
        </div>

        <div className="pt-5">
          <Input
            label="New Password"
            name="newPassword"
            register={passwordForm.register}/>
        </div>

        <NormalButton
          onClick={passwordForm.handleSubmit(onChangePassword)}
          className="bg-warning">Change</NormalButton>
      </section>


      <SaveChanges
        setValue={passwordForm.setValue}
        onSave={onChangePassword}
        obj={user} />
    </form>    
  );
}
 
export default UserSettingsSecurity;
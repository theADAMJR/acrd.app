import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDevMode } from '../../../store/config';
import { openSaveChanges } from '../../../store/ui';
import { updateSelf, deleteSelf, uploadUserAvatar } from '../../../store/users';
import NormalButton from '../../utils/buttons/normal-button';
import Category from '../../utils/category';
import Input from '../../inputs/input';
import Toggle from '../../inputs/toggle';
import SaveChanges from '../../utils/save-changes';
import FileInput from '../../inputs/file-input';

const UserSettingsOverview: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppState) => s.auth.user)!;
  const { register, handleSubmit, setValue } = useForm();
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);

  const onSave = (e) => {
    const onUpdate = (payload) => dispatch(updateSelf(payload));
    handleSubmit(onUpdate)(e);
  };
  const onDelete = () => {
    const confirmation = window.confirm('Are you sure you want to delete your user?');
    if (confirmation) dispatch(deleteSelf());
  }

  return (
    <div className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <form onChange={() => dispatch(openSaveChanges(true))}>
        <header>
          <h1 className="text-xl font-bold inline">My Account</h1>
        </header>

        <section className="w-1/2">
          <Input
            label="Username"
            name="username"
            register={register}
            options={{ value: user.username }}
            className="pt-5" />
          <Input
            label="Email"
            name="email"
            register={register}
            options={{ value: user.email }}
            className="pt-5" />
          <FileInput
            name="avatarURL"
            options={{ value: user.avatarURL }}
            onChange={(e) => {
              const file = e.currentTarget?.files?.[0];
              if (file) dispatch(uploadUserAvatar(file));
            }} />
        </section>

        <SaveChanges
          setValue={setValue}
          onSave={onSave}
          obj={user} />
      </form>

      <Category
      className="py-2 mt-5"
      title="Advanced Settings" />

      <section>
      <div className="w-1/2 pb-5">
        <label htmlFor="devMode">Dev Mode</label>
        <Toggle
          onChange={(e) => e.stopPropagation()}
          onClick={() => dispatch(toggleDevMode())}
          checked={devMode}
          className="float-right"
          id="devMode" />
      </div>

      <NormalButton
        id="deleteUserButton"
        role="button"
        onClick={handleSubmit(onDelete)}
        className="bg-danger">Delete</NormalButton>
      </section>
    </div>
  );
}
 
export default UserSettingsOverview;
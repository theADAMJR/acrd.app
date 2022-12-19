import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { openSaveChanges } from '../../../store/ui';
import { updateSelf, uploadUserAvatar } from '../../../store/users';
import Input from '../../inputs/input';
import SaveChanges from '../../utils/save-changes';
import FileInput from '../../inputs/file-input';

const UserSettingsOverview: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppState) => s.auth.user)!;
  const { register, handleSubmit, setValue } = useForm();

  const onSave = (e) => {
    const onUpdate = (payload) => dispatch(updateSelf(payload));
    handleSubmit(onUpdate)(e);
  };

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
    </div>
  );
}

export default UserSettingsOverview;
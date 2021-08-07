import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSelf, updateSelf } from '../../store/users';
import NormalButton from '../utils/buttons/normal-button';
import Category from '../utils/category';
import Input from '../utils/input';
import Modal from './modal';

const UserSettings: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user);
  const { register, handleSubmit } = useForm();

  const onUpdate = (payload) => dispatch(updateSelf(payload));
  const onDelete = () => {
    const confirmation = window.confirm('Are you sure you want to delete your user?');
    confirmation && dispatch(deleteSelf());
  }
  
  return (user) ? (
    <Modal type={UserSettings} size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-3 bg-bg-secondary"></div>

        <div className="col-span-8 h-full">
          <form className="flex flex-col pt-14 pr-10 pl-20 h-full mt-1">
            <header>
              <h1 className="text-xl font-bold inline">My Account</h1>
            </header>
          
            <section>
              <div className="pt-5">
                <Input
                  label="Username"
                  name="username"
                  register={register}
                  options={{ value: user.username }} />
              </div>

              <div className="pt-5">
                <Input
                  label="Email"
                  name="email"
                  register={register}
                  options={{ value: user.email }} />
              </div>

              <div className="pt-5">
                <Input
                  label="Avatar URL"
                  name="avatarURL"
                  register={register}
                  options={{ value: user.avatarURL }} />
              </div>
            </section>

            <Category
              className="py-2 mt-5"
              title="Advanced Settings" />

            <section>
              <NormalButton
                onClick={handleSubmit(onDelete)}
                className="bg-danger">Delete</NormalButton>
              <NormalButton
                onClick={handleSubmit(onUpdate)}
                className="bg-success m-4">Save</NormalButton>
            </section>
          </form>
        </div>
      </div>
    </Modal>
  ) : null;
}
 
export default UserSettings;
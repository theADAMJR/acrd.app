import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSelf, updateSelf } from '../../store/users';
import Category from '../utils/category';
import Input from '../utils/input';
import Modal from './modal';

const UserSettings: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user);
  const { register, handleSubmit } = useForm();

  const update = (payload) => dispatch(updateSelf(payload));
  const del = () => {
    const confirmation = window.confirm('Are you sure you want to delete your user?');
    confirmation && dispatch(deleteSelf());
  }
  
  return (user) ? (
    <Modal type={UserSettings} size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-3 bg-bg-secondary"></div>

        <div className="col-span-8 h-full">
          <form
            style={{height: '100%', padding: '60px 40px 80px'}}
            className="flex flex-col">
            <header>
              <h1 className="text-xl font-bold inline">My Account</h1>
            </header>
          
            <div className="flex-grow">
              <div className="pt-5">
                <Input
                  label="Username"
                  name="username"
                  register={register}
                  options={{ value: user.username }} />
              </div>

              <div className="pt-5">
                <label
                  htmlFor="email"
                  className="uppercase">Email</label>
                <input
                  id="email"
                  type="text"
                  {...register('email', { value: user.email })}
                  className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
              </div>

              <div className="pt-5">
                <label
                  htmlFor="avatarURL"
                  className="uppercase">Avatar URL</label>
                <input
                  id="avatarURL"
                  type="text"
                  {...register('avatarURL', { value: user.avatarURL })}
                  className="block w-full h-10 p-2 bg-bg-secondary rounded focus:outline-none" />
              </div>
            </div>

            <Category title="Advanced Settings" />

            <div>
              <button
                onClick={del}
                type="button"
                style={{height: '38px', padding: '2px 16px'}}
                className="background bg-danger heading rounded-md m-4">Delete</button>

              <button
                onClick={handleSubmit(update)}
                type="button"
                style={{height: '38px', padding: '2px 16px'}}
                className="background bg-success heading rounded-md m-4">Save</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  ) : null;
}
 
export default UserSettings;
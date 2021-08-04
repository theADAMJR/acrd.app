import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closedModal } from '../../store/ui';
import { deleteSelf, updateSelf } from '../../store/users';
import Category from '../category/category';

const UserSettings: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppStore) => s.auth.user);
  const openModal = useSelector((s: Store.AppStore) => s.ui.openModal)!;
  const { register, handleSubmit } = useForm();

  const update = (payload) => dispatch(updateSelf(payload));
  const del = () => {
    const confirmation = window.confirm('Are you sure you want to delete your user?');
    confirmation && dispatch(deleteSelf());
  }
  
  return (user) ? (
    <ReactModal
      className="overflow-auto absolute bg-bg-primary h-full w-full outline-none"
      appElement={document.querySelector('#root')!}
      isOpen={openModal === UserSettings.name}
      onRequestClose={() => dispatch(closedModal())}>
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
                <label
                  htmlFor="username"
                  className="uppercase">Username</label>
                <input
                  id="username"
                  type="text"
                  {...register('username', { value: user.username })}
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
    </ReactModal>
  ) : null;
}
 
export default UserSettings;
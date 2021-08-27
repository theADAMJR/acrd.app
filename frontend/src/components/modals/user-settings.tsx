import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { openSaveChanges } from '../../store/ui';
import { deleteSelf, updateSelf } from '../../store/users';
import NormalButton from '../utils/buttons/normal-button';
import Category from '../utils/category';
import Input from '../utils/input';
import SaveChanges from '../utils/save-changes';
import TabLink from '../utils/tab-link';
import Modal from './modal';

const UserSettings: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const { register, handleSubmit, setValue } = useForm();
  const [tab, setTab] = useState('overview');

  const onSave = (e) => {
    const onUpdate = (payload) => dispatch(updateSelf(payload));
    handleSubmit(onUpdate)(e);
  };
  const onDelete = () => {
    const confirmation = window.confirm('Are you sure you want to delete your user?');
    if (confirmation) dispatch(deleteSelf());
  }

  return (user) ? (
    <Modal
      type={UserSettings}
      size="full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 bg-bg-secondary">
          <nav className="float-right flex-grow py-14 w-48 my-1 mr-4">
            <Category
              className="normal px-2.5 pb-1.5"
              title="User Settings" />
            <TabLink tab={tab} setTab={setTab}>Overview</TabLink>

            <div className="rounded-sm bg-bg-modifier-accent h-px w-42 my-2 mx-2.5 " />

            <Link
              to="/logout"
              className=" flex items-center rounded py-1.5 px-2.5 h-8 mb-0.5">Logout</Link>
          </nav>
        </div>

        <div className="col-span-8 h-full">
          <form
            onChange={() => dispatch(openSaveChanges(true))}
            className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
            <header>
              <h1 className="text-xl font-bold inline">My Account</h1>
            </header>

            <section className="w-1/3">
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
            </section>

            <SaveChanges
              setValue={setValue}
              onSave={onSave}
              obj={user} />
          </form>
        </div>
      </div>
    </Modal>
  ) : null;
}

export default UserSettings;
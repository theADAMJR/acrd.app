import { useDispatch, useSelector } from 'react-redux';
import Category from '../../utils/category';
import CircleButton from '../../utils/buttons/circle-button';
import Toggle from '../../inputs/toggle';
import { deleteSelf } from '../../../store/users';
import { toggleDevMode } from '../../../store/config';

const UserSettingsAdvanced: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const selfUser = useSelector((s: Store.AppState) => s.auth.user);
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);

  const requestDelete = () => {
    const confirmation = window.prompt(
      `WARNING: You are about to delete account '${selfUser.username}'\n` +
      `Type \'accord\' to confirm deletion.`
    );
    if (confirmation == 'accord')
      dispatch(deleteSelf());
  };

  return (
    <div className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Advanced Settings</h1>
      </header>

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

        <Category
          className="py-2 mt-5"
          title="Delete Account" />

        <CircleButton
          id="deleteUserButton"
          onClick={requestDelete}
          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          className="border-danger red m-2">Delete</CircleButton>
      </section>
    </div>
  );
}

export default UserSettingsAdvanced;
import { Entity } from '@accord/types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { openSaveChanges } from '../../../store/ui';
import { updateSelf } from '../../../store/users';
import SaveChanges from '../../utils/save-changes';

const UserSettingsThemes: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppState) => s.auth.user)!;
  const { register, handleSubmit, setValue } = useForm();
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);

  const onSave = (e) => {
    const onUpdate = (payload) => dispatch(updateSelf(payload));
    handleSubmit(onUpdate)(e);
  };

  const themes: Entity.Theme[] = [{
    id: 'default',
    createdAt: new Date('05/02/2021'),
    creatorId: '177127942839676928',
    name: 'Horizon (default)',
    styles: '',
  }];

  function applyTheme(id: string) {
    const theme = themes.find(t => t.id === id);
    const themeWrapper = document.querySelector('#themeWrapper')!;
    themeWrapper.innerHTML = `<style>${theme?.styles}</style>`;
  }

  return (
    <div className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <form onChange={() => dispatch(openSaveChanges(true))}>
        <header>
          <h1 className="text-xl font-bold inline">Themes</h1>
        </header>

        <section className="pt-2">
          {themes.map(t => <div
            key={t.id}
            onClick={() => applyTheme(t.id)}>{t.name}</div>)}
        </section>

        <SaveChanges
          setValue={setValue}
          onSave={onSave}
          obj={user} />
      </form>
    </div>
  );
}
 
export default UserSettingsThemes;
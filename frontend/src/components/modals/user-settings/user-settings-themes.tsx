import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme, getTheme } from '../../../store/themes';
import { updateSelf } from '../../../store/users';
import Input from '../../inputs/input';
import SidebarIcon from '../../navigation/sidebar/sidebar-icon';
import CircleButton from '../../utils/buttons/circle-button';
import NormalButton from '../../utils/buttons/normal-button';

const UserSettingsThemes: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const themes = useSelector((s: Store.AppState) => s.entities.themes);
  const user = useSelector((s: Store.AppState) => s.auth.user);
  const themeId = user.activeThemeId;
  const [tab, setTab] = useState(themeId);
  
  useEffect(() => {
    const themeWrapper = document.querySelector('#themeWrapper')!;
    const theme = getTheme(themeId, themes)!;
    themeWrapper.innerHTML = `<style>${theme.styles}</style>`;
  }, [themeId]);

  const SideIcons = () => (
    <div className="flex items-center flex-col">
      {themes.map(t => (
        <div
          key={t.id}
          className="w-12"
          onClick={() => setTab(t.id)}
          title={t.name}>
          <SidebarIcon
            childClasses={classNames('bg-bg-secondary', {
              'border-2 border-primary h-[3.1rem]': t.id === tab,
            })}
            imageURL={t.iconURL}
            name={t.name}
            disableHoverEffect />
        </div>
      ))}
      <CircleButton
        className="m-2"
        onClick={() => dispatch(createTheme('New Theme'))}
        style={{ color: 'var(--success)' }}>+</CircleButton>
    </div>
  );

  const ThemeDetails = () => {
    const { register } = useForm();
    const theme = themes.find(t => t.id === tab);
  
    const applyTheme = () => dispatch(updateSelf({ activeThemeId: tab }));
    
    return (tab) ? (
      <div className="px-5">
        <h1></h1>
        <Input
          tooltip="kek"
          className="w-1/2"
          label="Code"
          name="code"
          register={register}
          options={{ value: theme.code }} />

        <NormalButton
          className="bg-success dark mt-5"
          onClick={applyTheme}>Apply</NormalButton>
      </div>
    ) : null;
  }

  return (
    <div className="grid grid-cols-12 flex-col pt-14 px-10 pb-20 h-full mt-1 gap-8">
      <div className="col-span-1"><SideIcons /></div>
      <div className="col-span-11"><ThemeDetails /></div>
    </div>
  );
}
 
export default UserSettingsThemes;
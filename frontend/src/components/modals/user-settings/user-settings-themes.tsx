import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../../../store/themes';
import { actions as ui } from '../../../store/ui';
import { updateSelf } from '../../../store/users';
import SidebarIcon from '../../navigation/sidebar/sidebar-icon';
import Category from '../../utils/category';

const UserSettingsThemes: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const themes = useSelector((s: Store.AppState) => s.entities.themes);
  const user = useSelector((s: Store.AppState) => s.auth.user);

  const featuredThemes = themes.filter(t => t.isFeatured);
  const themeId = user.activeThemeId;

  useEffect(() => {
    const themeWrapper = document.querySelector('#themeWrapper')!;
    const theme = getTheme(themeId, themes)!;

    themeWrapper.innerHTML = (!themeId || themeId === 'default')
      ? `<style></style>`
      : `<style>${theme.styles}</style>`;
  }, [themeId]);

  const applyTheme = (id: string) => dispatch(updateSelf({ activeThemeId: id }));

  return (
    <div className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Themes</h1>
      </header>

      <section className="pt-2">
        <Category
          className="mb-2"
          count={featuredThemes.length}
          title="Featured" />
        {themes.map(t => (
          <div
            className="w-12 mr-2 float-left"
            key={t.id}
            onClick={() => applyTheme(t.id)}
            title={t.name}>
            <SidebarIcon
              childClasses="bg-bg-secondary"
              imageURL={t.iconURL}
              name={t.name}
              disableHoverEffect />
          </div>
        ))}

        <div
          className="w-12 float-left"
          onClick={() => dispatch(ui.openedModal('CreateTheme'))}>
          <SidebarIcon
            childClasses="bg-success dark font-black"
            name="+"
            disableHoverEffect />
        </div>
      </section>
    </div>
  );
}
 
export default UserSettingsThemes;
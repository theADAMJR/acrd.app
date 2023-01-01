import { Entity } from '@acrd/types';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import fetchEntities from '../../store/actions/fetch-entities';
import { getGuild, getGuildMembers } from '../../store/guilds';
import { joinGuild } from '../../store/members';
import { applyTheme, getThemeByCode, getTheme, unlockTheme } from '../../store/themes';
import { getUser, updateSelf } from '../../store/users';
import SidebarIcon from '../navigation/sidebar/sidebar-icon';
import FoundUsername from '../user/username';
import NormalButton from '../utils/buttons/normal-button';
import FullParticles from '../utils/full-particles';
import PageWrapper from './page-wrapper';

interface ThemePageProps { }

const ThemePage: React.FunctionComponent<ThemePageProps> = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { themeCode }: any = useParams();
  const theme: Entity.Theme = useSelector(getThemeByCode(themeCode));
  const creatorUser: Entity.User = useSelector(getUser(theme?.creatorId));

  useEffect(() => {
    dispatch(unlockTheme(themeCode));
  }, []);

  const Wrapper: React.FunctionComponent = ({ children }) => (
    <PageWrapper pageTitle={`acrd.app | ${theme?.name} Theme`}>
      <div className="flex items-center absolute justify-center h-screen left-[35%]">
        <section className="rounded-md shadow bg-bg-primary p-8 w-[478px]">
          {children}
        </section>
      </div>
    </PageWrapper>
  );

  const NotFoundIcon = () => (
    <FontAwesomeIcon
      className="float-left mr-2"
      color="var(--warning)"
      icon={faSearchLocation}
      size="2x" />
  );

  if (!theme)
    return (
      <Wrapper>
        <NotFoundIcon />
        <h1 className="text-xl font-bold warning">Theme not found...</h1>
        <p className="lead">This is not the theme you are looking for.</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <FullParticles />
      <h1 className="text-3xl font-bold text-center">Unlocked '{theme.name}'!</h1>
      <div className="flex mt-5">
        <SidebarIcon
          name={theme.name}
          imageURL={theme.iconURL}
          childClasses="bg-bg-tertiary w-24 h-24 pt-6 text-xl"
          disableHoverEffect />
        <div className="flex justify-around items-center w-full mx-5">
          <span className='text-center'>
            <div className="heading font-bold">Created By</div>
            <FoundUsername user={creatorUser} />
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-5 mx-5 mt-5">
        <NormalButton
          onClick={() => {
            dispatch(updateSelf({ activeThemeId: theme.id }));
            history.push(`/channels/@me`);
          }}
          className="bg-success dark">Apply</NormalButton>
        <Link to="/channels/@me">
          <NormalButton className="bg-danger light">Cancel</NormalButton>
        </Link>
      </div>
    </Wrapper>
  );
}

export default ThemePage;
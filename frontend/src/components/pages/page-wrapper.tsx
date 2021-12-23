import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as ui } from '../../store/ui';
import ChannelSettings from '../modals/channel-settings/channel-settings';
import CreateChannel from '../modals/create-channel';
import CreateGuild from '../modals/create-guild';
import CreateInvite from '../modals/create-invite';
import GuildSettings from '../modals/guild-settings/guild-settings';
import ImagePreview from '../modals/image-preview';
import UserProfile from '../modals/user-profile';
import UserSettings from '../modals/user-settings/user-settings';
import { filterProps } from '../utils/react/react-shush-error';
import WSListener from '../ws-listener';

export type PageWrapperProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement> & { pageTitle?: string; };

// all separate pages should be wrapped by this
const PageWrapper: React.FunctionComponent<PageWrapperProps> = (props) => {
  const dispatch = useDispatch();
  const dropdown = useSelector((s: Store.AppState) => s.ui.openDropdown);
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);
  const [hasAnnoyedUser, setHasAnnoyedUser] = useState(false); 
  
  useEffect(() => {
    document.title = props.pageTitle ?? 'accord.app';
  }, []);

  const onClick = () => dropdown && dispatch(ui.toggleDropdown({}));

  if (!devMode && !hasAnnoyedUser) {
    setHasAnnoyedUser(true);
    console.log(`%cAttention!`, `color: red; font-size: 32px; font-weight: 900;`);
    console.log(
      `%cIf someone told you to paste something in this console, it's probably against the TOS and could steal your account.`,
      `color: darkred; font-size: 16px; font-weight: 700;`
    );
  }

  return (
    <div onClick={onClick}
      {...filterProps(props)}>
      {props.children}
      <WSListener />
      {/* modals */}
      <CreateChannel />
      <CreateGuild />
      <CreateInvite />
      <ChannelSettings />
      <GuildSettings />
      <ImagePreview />
      <UserSettings />
      <UserProfile />
    </div>
  );
}
 
export default PageWrapper;
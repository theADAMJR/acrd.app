import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as ui } from '../../store/ui';
import ChannelSettings from '../modals/channel-settings/channel-settings';
import CreateChannel from '../modals/create-channel';
import CreateGuild from '../modals/create-guild';
import CreateInvite from '../modals/create-invite';
import GuildSettings from '../modals/guild-settings/guild-settings';
import UserProfile from '../modals/user-profile';
import UserSettings from '../modals/user-settings/user-settings';
import WSListener from '../ws-listener';

export type PageWrapperProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement> & { pageTitle?: string; };

// all separate pages should be wrapped by this
const PageWrapper: React.FunctionComponent<PageWrapperProps> = (props) => {
  const dispatch = useDispatch();
  const dropdown = useSelector((s: Store.AppState) => s.ui.openDropdown);
  
  useEffect(() => {
    document.title = props.pageTitle ?? 'accord.app';
  }, []);

  const onClick = () => dropdown && dispatch(ui.toggleDropdown({}));

  return (
    <div onClick={onClick}
      {...props}>
      {props.children}
      <WSListener />
      {/* modals */}
      <CreateChannel />
      <CreateGuild />
      <CreateInvite />
      <ChannelSettings />
      <GuildSettings />
      <UserSettings />
      <UserProfile />
    </div>
  );
}
 
export default PageWrapper;
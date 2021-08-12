import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ready } from '../../store/auth';
import { toggleDropdown } from '../../store/ui';
import CreateChannel from '../modals/create-channel';
import CreateGuild from '../modals/create-guild';
import CreateInvite from '../modals/create-invite';
import GuildSettings from '../modals/guild-settings';
import UserSettings from '../modals/user-settings';
import WSListener from '../ws-listener';

export type PageWrapperProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

// all separate pages should be wrapped by this
const PageWrapper: React.FunctionComponent<PageWrapperProps> = (props) => {
  const dispatch = useDispatch();
  const dropdown = useSelector((s: Store.AppStore) => s.ui.openDropdown);
  
  useEffect(() => {
    document.title = props.pageTitle ?? 'DClone';
  }, []);
  
  return (
    <div
      onClick={() => dropdown && dispatch(toggleDropdown({}))}
      {...props}>
      {props.children}
      <WSListener />
      <CreateChannel />
      <CreateGuild />
      <CreateInvite />
      <GuildSettings />
      <UserSettings />
    </div>
  );
}
 
export default PageWrapper;
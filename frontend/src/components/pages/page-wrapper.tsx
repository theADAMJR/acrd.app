import ContextMenus from '../context-menus';
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

const PageWrapper: React.FunctionComponent<PageWrapperProps> = (props) => {
  return (
    <div {...props}>
      {props.children}
      <WSListener />
      <CreateChannel />
      <CreateGuild />
      <CreateInvite />
      <GuildSettings />
      <UserSettings />
      <ContextMenus />
    </div>
  );
}
 
export default PageWrapper;
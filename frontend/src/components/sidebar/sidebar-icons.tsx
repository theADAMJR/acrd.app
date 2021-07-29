import * as React from 'react';
import { useStore } from 'react-redux';
import GuildIcon from '../guild/guild-icon/guild-icon';
import './sidebar-icons.scoped.css';
 
const SidebarIcons: React.FunctionComponent = () => {
  const state: Store.AppStore = useStore().getState();
  const user = state.auth.user;
  const guilds = state.entities.guilds;
  
  const iconify = (content: JSX.Element) => 
      <div className="guild-icon flex justify-center mb-1">{content}</div>;

  const guildIcons = guilds.map(g => <GuildIcon key={g.id} guild={g} />);
  const userAvatar = iconify(
    <img
      className="cursor-pointer h-12 w-12 rounded-full"
      src={user.avatarURL}
      alt={user.username} />
  );
  const plusIcon = <div className="flex items-center justify-center rounded-full h-12 w-12 background-primary color-success text-4xl font-light pb-1">+</div>;
  
  return (
    <div className="sidebar-icons flex flex-col background-tertiary px-2">
      {iconify(userAvatar)}
      {iconify(<div className="icon-separator mb-1" />)}
      {guildIcons}
      {plusIcon}
    </div>
  );
}
 
export default SidebarIcons;
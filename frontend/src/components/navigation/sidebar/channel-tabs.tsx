import './channel-tabs.scoped.css';
import { faHashtag, faVolumeUp, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import usePerms from '../../../hooks/use-perms';
import { getChannelUsers, joinVoiceChannel } from '../../../store/channels';
import { getGuild, getGuildChannels } from '../../../store/guilds';
import { actions as ui } from '../../../store/ui';
import ChannelMenu from '../../ctx-menus/channel-menu';
import Username from '../../user/username';
import React from 'react';
import { Entity } from '@accord/types';

const ChannelTabs: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { activeGuild, activeChannel } = useSelector((s: Store.AppState) => s.ui);
  const guildChannels = useSelector(getGuildChannels(activeGuild?.id));
  const perms = usePerms();

  if (!activeGuild || !perms.can('VIEW_CHANNELS', activeGuild.id)) return null;

  const ChannelTab = ({ channel }: { channel: Entity.Channel }) => {
    const link = (channel.type === 'VOICE')
      ? '#'
      : `/channels/${activeGuild!.id}/${channel.id}`;
    const icon = { 'TEXT': faHashtag, 'VOICE': faVolumeUp }[channel.type];

    const onClick = () => {
      if (channel.type !== 'VOICE') return;
      
      dispatch(joinVoiceChannel(channel.id));
    };

    const VCMembers: React.FunctionComponent = () => {
      const users = useSelector(getChannelUsers(channel.id));
      if (channel.type !== 'VOICE' || !users.length) return null;

      return <div className="p-2 pl-3">{users.map(u =>
        <ContextMenuTrigger key={u.id} id={u.id}>
          <div className="mb-1">
            <Username user={u} size="sm" guild={activeGuild} />
          </div>
        </ContextMenuTrigger>
      )}</div>;
    };

    const ChannelTabContent: React.FunctionComponent = () => (
      <span className="tab flex-grow flex justify-between">
        <span>{channel.name}</span>
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            dispatch(ui.pageSwitched({ channel, guild: activeGuild }));
            dispatch(ui.openedModal('ChannelSettings'));
          }}
          className="cursor-pointer opacity-100">
          {perms.can('MANAGE_CHANNELS', activeGuild.id)
            && <FontAwesomeIcon className="settings" icon={faCog} />}
        </span>
      </span>
    );

    return (
      <>
        <ContextMenuTrigger key={channel.id} id={channel.id}>
          {/* <Draggable> */}
            <Link
              onClick={onClick}
              to={link}
              className={classNames(
                `cursor-pointer flex items-center rounded h-8 p-2 pl-3`,
                { active: channel.id === activeChannel?.id },
              )}>
              <FontAwesomeIcon
                size="xs"
                className={classNames(
                  `float-left scale-150 muted fill-current z-0`,
                  (channel.type === 'VOICE') ? 'mr-2' : 'mr-3',
                )}
                icon={icon} />
              <ChannelTabContent />
              <ChannelMenu channel={channel} />
            </Link>
          {/* </Draggable> */}
        </ContextMenuTrigger>
        <VCMembers />
      </>
    );
  }

  return (
    <div className="channel-tabs">
      {guildChannels.map(c => <ChannelTab key={c.id} channel={c} />)}
    </div>
  );
};
export default ChannelTabs;
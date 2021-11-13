import Username from '../../user/username';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPhoneSlash, faSignal } from '@fortawesome/free-solid-svg-icons';
import { actions as ui } from '../../../store/ui';
import { getChannel, leaveVoiceChannel } from '../../../store/channels';
import { getGuild } from '../../../store/guilds';
import classNames from 'classnames';
import { useEffect } from 'react';
 
const SidebarFooter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: Store.AppState) => s.auth.user)!;

  const VoiceFooter = () => {
    const channelId = user.voice?.channelId;
    const channel = useSelector(getChannel(channelId ?? ''));
    const guild = useSelector(getGuild(channel?.guildId ?? ''));
    const ping = useSelector((s: Store.AppState) => s.meta.ping);

    if (!channel || !guild) return null;
    
    return (
      <div id="sidebarFooter">
        <div className="justify-between flex items-center p-3 pr-4">
          <div title={ping ? `Ping ${ping}ms` : 'Pinging server...'}>
            <FontAwesomeIcon
              icon={faSignal}
              className={classNames({
                'success': ping && ping < 100,
                'secondary': ping && ping >= 100 && ping < 200,
                'warning': ping && ping >= 200 && ping < 300,
                'danger': ping && ping >= 300,
                'muted': !ping,
              })} />
            <strong className="success ml-2">Voice Connected</strong>
            <div className="normal">{channel.name} / {guild.name}</div>
          </div>
          <FontAwesomeIcon
            onClick={() => dispatch(leaveVoiceChannel())}
            className="float-right cursor-pointer"
            icon={faPhoneSlash} />
        </div>
        <hr className="border-bg-primary" />
      </div>
    );
  }
  
  return (
    <div className="bg-bg-secondary-alt">
      <VoiceFooter />
      <div className="relative flex items-center py-2">
        <div className="select-all">
          <Username user={user} />
        </div>
        <FontAwesomeIcon
          id="userSettingsButton"
          onClick={() => dispatch(ui.openedModal('UserSettings'))}
          className="float-right cursor-pointer absolute right-4"
          icon={faCog} />
      </div>
    </div>
  );
}
 
export default SidebarFooter;
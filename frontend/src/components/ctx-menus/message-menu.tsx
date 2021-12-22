import { Entity } from '@accord/types';
import { ContextMenu } from 'react-contextmenu';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DevModeMenuSection from './dev-mode-menu-section';

export interface MessageMenuProps {
  message: Entity.Message;
}
 
const MessageMenu: React.FunctionComponent<MessageMenuProps> = ({ message }) => {
  const { guildId }: any = useParams();
  const devMode = useSelector((s: Store.AppState) => s.config.devMode);

  return (guildId) ? (
    <ContextMenu
      key={message.id}
      id={message.id}
      className="bg-bg-tertiary rounded shadow w-48 p-2">
      <div className="overflow-hidden">
        <span className="bg-bg-primary p-1 rounded max-w-full">{message.content}</span>
      </div>
      {devMode && <DevModeMenuSection ids={[
        { title: 'Message ID', id: message.id },
      ]} />}
    </ContextMenu>
  ) : null;
}
 
export default MessageMenu;
import { Entity } from '@accord/types';
import { FunctionComponent } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { useSelector } from 'react-redux';
import { getMember } from '../../../store/members';
import { getMemberHighestRole } from '../../../store/roles';
import MessageTimestamp from './message-timestamp';

interface MessageHeaderProps {
  message: Entity.Message;
  author?: Entity.User;
  isExtra?: boolean;
}
 
const MessageHeader: FunctionComponent<MessageHeaderProps> = ({ author, message, isExtra = false }) => {
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const member = useSelector(getMember(guild.id, message.authorId));
  const highestRole = useSelector(getMemberHighestRole(guild.id, member?.userId ?? ''));
  if (isExtra) return null;

  return (!message.system && author) ? (
    <div>
      <ContextMenuTrigger id={author.id}>
        <span
          style={{ color: highestRole.color }}
          className="text-base heading hover:underline cursor-pointer mr-2">{author.username}</span>
      </ContextMenuTrigger>
      <span className="text-xs">
        <MessageTimestamp message={message} />
      </span>
    </div>
  ) : (
    <span className="text-xs muted">
      <MessageTimestamp message={message} />
    </span>    
  );
}
 
export default MessageHeader;
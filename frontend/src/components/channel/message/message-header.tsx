import moment from 'moment';
import { FunctionComponent } from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { useSelector } from 'react-redux';
import { getMember } from '../../../store/members';
import { getMemberHighestRole } from '../../../store/roles';

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
  
  const toDays = (date: Date) => date.getTime() / 1000 / 60 / 60 / 24; 

  const createdAt = new Date(message.createdAt);
  const midnight = new Date(new Date().setHours(0, 0, 0, 0));
  const daysAgo = Math.floor(toDays(midnight) - toDays(createdAt));
  
  const getTimestamp = () => {
    const wasToday = midnight.getDate() === createdAt.getDate();
    if (wasToday) return '[Today at] HH:mm';
    else if (daysAgo === 1) return '[Yesterday at] HH:mm';
    return 'DD/MM/YYYY';
  };

  return (!message.system && author) ? (
    <div>
      <ContextMenuTrigger id={author.id}>
        <span
          style={{ color: highestRole.color }}
          className="text-base heading hover:underline cursor-pointer mr-2">{author.username}</span>
      </ContextMenuTrigger>
      <span className="text-xs">{moment(createdAt).format(getTimestamp())}</span>
    </div>
  ) : (
    <span className="text-xs muted">{moment(createdAt).format(getTimestamp())}</span>    
  );
}
 
export default MessageHeader;
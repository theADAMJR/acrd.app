import './message.scoped.css';

import moment from 'moment';
import { useSelector } from 'react-redux';
import { getChannelMessages } from '../../../store/messages';
import { getUser } from '../../../store/users';
import environment from '../../../environment';
import MessageBox from '../message-box';
import MessageToolbar from './message-toolbar';
import { getMemberHighestRole } from '../../../store/roles';
import { getSelfMember } from '../../../store/members';
import { ContextMenuTrigger } from 'react-contextmenu';
import MessageMenu from '../../ctx-menus/message-menu';

export interface MessageProps {
  message: Entity.Message;
}

const Message: React.FunctionComponent<MessageProps> = ({ message }: MessageProps) => {
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const member = useSelector(getSelfMember(guild.id))!;
  const highestRole = useSelector(getMemberHighestRole(guild.id, member.userId));
  const author = useSelector(getUser(message.authorId));
  const messages = useSelector(getChannelMessages(message.channelId));
  const editingMessageId = useSelector((s: Store.AppState) => s.ui.editingMessageId);
  const createdAt = new Date(message.createdAt);

  const isExtra = () => {
    const i = messages.findIndex(m => m.id === message.id);
    const prev = messages[i - 1];
    if (!prev) return false;

    const minsSince = moment(createdAt).diff(prev.createdAt, 'minutes');    
    const minsToSeparate = 5;

    return minsSince <= minsToSeparate
        && prev.authorId === message.authorId;
  }
  const isActuallyExtra = isExtra();

  const leftSide = () => (isActuallyExtra)
    ? <span className="timestamp text-xs">
        {moment(createdAt).format('HH:mm')}
      </span>
    : <img
        className="rounded-full cursor-pointer w-10 h-10"
        src={`${environment.cdnURL}${author.avatarURL}`}
        alt={author.username} />;
  
  const MessageHeader = () => {
    if (isActuallyExtra) return null;

    const today = () => {
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      return today;
    }
  
    const days = moment(today()).diff(createdAt.setHours(0), 'days');
    const day = {
      [1]: 'Yesterday',
      [0]: 'Today',
      [-1]: 'Tomorrow',
    }[days];
    const timestamp = (day) ? `[${day}] [at] HH:mm` : 'DD/MM/YYYY';

    return (
      <div>
        <ContextMenuTrigger id={author.id}>
          <span
            style={{ color: highestRole.color }}
            className="text-base heading hover:underline cursor-pointer mr-2">{author.username}</span>
        </ContextMenuTrigger>
        <span className="text-xs">{moment(createdAt).format(timestamp)}</span>
      </div>
    );
  }

  const MessageContent = () => (editingMessageId === message.id)
    ? <MessageBox
        content={message.content}
        editingMessageId={message.id} />
    : <div className="relative">
        <div className="normal whitespace-pre-wrap">{message.content}{message.updatedAt &&
          <span className="select-none muted edited text-xs ml-1">(edited)</span>}</div>
      </div>;

  return (
    <ContextMenuTrigger key={message.id} id={message.id}>
      <div className={`message flex ${!isActuallyExtra && 'mt-4'}`}>
        <div className="flex-shrink-0 left-side text-xs w-16 mr-2 pl-5 pt-1">{leftSide()}</div>
        <div className="relative flex-grow px-2">
          <div className="absolute toolbar right-0 -mt-3 z-10">
            <MessageToolbar message={message} />
          </div>
          <MessageHeader />
          <MessageContent />
        </div>
        <div className="right-side w-12" />
      </div>
      <MessageMenu message={message} />
    </ContextMenuTrigger>
  );
}

export default Message;
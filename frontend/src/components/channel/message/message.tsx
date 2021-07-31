import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getChannelMessages } from '../../../store/messages';
import { getUser } from '../../../store/users';
import environment from '../../../environment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getGuildByChannelId } from '../../../store/guilds';

import './message.scoped.css';
import { startedEditingMessage } from '../../../store/ui';
import MessageBox from '../message-box/message-box';

export interface MessageProps {
  message: Entity.Message;
}

const Message: React.FunctionComponent<MessageProps> = ({ message }: MessageProps) => {
  const dispatch = useDispatch();

  const author = useSelector(getUser(message.authorId)) as Entity.User;
  const selfUser = useSelector((s: Store.AppStore) => s.auth.user)!;
  const messages = useSelector(getChannelMessages(message.channelId));
  const guild = useSelector(getGuildByChannelId(message.channelId));
  const editingMessageId = useSelector((s: Store.AppStore) => s.ui.editingMessageId);

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

  const leftSide = () => {
    const time = createdAt
      .toLocaleTimeString()
      .slice(0, 5);

    return (isExtra())
      ? <span className="timestamp text-xs">{time}</span>
      : <img
          className="rounded-full cursor-pointer"
          src={`${environment.rootAPIURL}${author.avatarURL}`}
          alt={author.username} />;
  }
  
  const messageHeader = () => {
    if (isExtra()) return;

    const days = moment(new Date()).diff(createdAt, 'day');
    const day = { [1]: 'Yesterday', [0]: 'Today', [-1]: 'Tomorrow' }[days];
    const format = (day)
      ? `[${day}] [at] HH:MM`
      : 'DD/MM/YYYY';

    const timestamp = moment(createdAt).format(format);

    return (<>
      <span className="text-base heading hover:underline cursor-pointer mr-2">{author.username}</span>
      <span className="text-xs">{timestamp}</span>
    </>);
  }

  const isAuthor = message.authorId === selfUser.id;
  const canManage = guild?.ownerId === selfUser.id || isAuthor;
  const isEditing = editingMessageId === message.id;

  const messageClass = `message flex ${!isExtra() && 'mt-4'}`;
  return (
    <div className={messageClass}>
      <div className="left-side pl-5">{leftSide()}</div>
      <div className="message-content flex-grow">
        {messageHeader()}

        {/* TODO: fix bad code */}
        {!isEditing && <div className="float-right shadow bg-bg-secondary px-2 rounded cursor-pointer">
          {isAuthor && <FontAwesomeIcon
            onClick={() => dispatch(startedEditingMessage(message.id))}
            className="mr-2"
            icon={faPencilAlt} />}
          {canManage && <FontAwesomeIcon style={{color: 'var(--danger)'}} icon={faTimes} />}
        </div>}
        {!isEditing && <div className="normal">{message.content}</div>}
        {isEditing && (<>
          <MessageBox content={message.content} editingMessageId={message.id} />
          <span className="py-2">escape to cancel. enter to save</span>
        </>)}
      </div>
      <div className="right-side" />
    </div>
  );
}

export default Message;
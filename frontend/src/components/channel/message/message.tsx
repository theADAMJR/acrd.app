import * as React from 'react';
import moment from 'moment';
import './message.scoped.css';
import { useSelector, useStore } from 'react-redux';
import { getChannelMessages } from '../../../store/messages';
import { getUser } from '../../../store/users';

export interface MessageProps {
  message: Entity.Message;
}

const Message: React.FunctionComponent<MessageProps> = ({ message }: MessageProps) => {
  const author = useSelector(getUser(message.authorId)) as Entity.User;
  const messages = useSelector(getChannelMessages(message.channelId));

  const isExtra = () => {
    const i = messages.findIndex(m => m.id === message.id);
    const prev = messages[i - 1];
    if (!prev) return false;

    const minsSince = moment(message.createdAt).diff(prev.createdAt, 'minutes');    
    const minsToSeparate = 5;

    return minsSince <= minsToSeparate
        && prev.authorId === message.authorId;
  }

  const leftSide = () => {
    const time = message.createdAt
      // .toLocaleTimeString()
      // .slice(0, 5);

    return (isExtra())
      ? <span className="timestamp text-xs">{time}</span>
      : <img
          className="rounded-full cursor-pointer"
          src={author.avatarURL}
          alt={author.username} />;
  }
  
  const messageHeader = () => {
    if (isExtra()) return;

    return (
      <>
        <span className="text-base heading hover:underline cursor-pointer mr-1">{author.username}</span>
        <span className="text-xs">{message.createdAt.toDateString()}</span>
      </>
    );
  }

  const messageClass = `message flex ${!isExtra() && 'mt-4'}`;
  return (
    <div className={messageClass}>
      <div className="left-side pl-5">{leftSide()}</div>
      <div className="message-content flex-grow">
        {messageHeader()}
        <div className="normal">{message.content}</div>
      </div>
      <div className="right-side" />
    </div>
  );
}

export default Message;
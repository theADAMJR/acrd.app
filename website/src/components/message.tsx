import * as React from 'react';
import { temp } from '../utils/src/temp';
import moment from 'moment';
import './message.scoped.css';

export interface MessageProps {
  author: Entity.User;
  message: Entity.Message;
} 
export interface MessageState {}
 
class Message extends React.Component<MessageProps, MessageState> {
  get isExtra() {
    const { message } = this.props;
    const messages = temp.messages;

    const i = messages.findIndex(m => m.id === message.id);
    const prev = messages[i - 1];
    if (!prev) return false;

    const minsSince = moment(message.createdAt).diff(prev.createdAt, 'minutes');    
    const minsToSeparate = 5;

    return minsSince <= minsToSeparate
      && prev.authorId === message.authorId;
  }

  get leftSide() {
    const { message, author } = this.props;
    const time = message.createdAt
      .toLocaleTimeString()
      .slice(0, 5);

    return (this.isExtra)
      ? <span className="timestamp text-xs">{time}</span>
      : <img className="rounded-full cursor-pointer" src={author.avatarURL} alt={author.username} />;
  }

  get messageHeader() {
    if (this.isExtra) return;

    const { author, message } = this.props;
    return (
      <>
        <span className="text-base color-heading hover:underline cursor-pointer mr-1">{author.username}</span>
        <span className="text-xs">{message.createdAt.toDateString()}</span>
      </>
    );
  }
  
  render() {
    const messageClass = `message flex ${!this.isExtra && 'mt-4'}`;
    return (
      <div className={messageClass}>
        <div className="left-side pl-5">{this.leftSide}</div>
        <div className="message-content flex-grow">
          {this.messageHeader}
          <div className="color-normal">{this.props.message.content}</div>
        </div>
        <div className="right-side" />
      </div>
    );
  }
}
 
export default Message;
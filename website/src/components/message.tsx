import * as React from 'react';
import { temp } from '../utils/src/temp';
import './message.css';

export interface MessageProps {
  author: Entity.User;
  message: Entity.Message;
} 
export interface MessageState {}
 
class Message extends React.Component<MessageProps, MessageState> {
  get isExtra() {
    const currentIndex = temp.messages.findIndex(m => m.id === this.props.message.id);
    const previousMessage = temp.messages[currentIndex - 1];

    return previousMessage
      && new Date() > new Date(previousMessage.createdAt);
  }

  get leftSide() {
    const { author } = this.props;

    return (this.isExtra)
      ? '00:00'
      : <img className="rounded-full" src={author.avatarURL} alt={author.username} />;
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
    return (
      <div className="message flex mt-4">
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
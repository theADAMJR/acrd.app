import * as React from 'react';
import { temp } from '../utils/src/temp';
import Message from './message';
import MessageBox from './message-box';
import './text-based-channel.css';

export interface TextBasedChannelProps {}
export interface TextBasedChannelState {}
 
class TextBasedChannel extends React.Component<TextBasedChannelProps, TextBasedChannelState> {
  get messages() {
    return temp.messages
      .map(m => <Message key={m.id} author={temp.users[0]} message={m} />);
  }
  
  render() { 
    return (
      <div className="text-based-channel flex flex-col flex-grow">
        <div className="messages">{this.messages}</div>
        <MessageBox />
      </div>
    );
  }
}
 
export default TextBasedChannel;
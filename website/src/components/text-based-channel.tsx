import * as React from 'react';
import { temp } from '../utils/src/temp';
import Message from './message';

export interface TextBasedChannelProps {}
export interface TextBasedChannelState {}
 
class TextBasedChannel extends React.Component<TextBasedChannelProps, TextBasedChannelState> {
  get messages() {
    return temp.messages
      .map(m => <Message key={m.id} author={temp.users[0]} message={m} />);
  }
  
  render() { 
    return (
      <div className="text-based-channel flex-grow">
        {this.messages}
      </div>
    );
  }
}
 
export default TextBasedChannel;
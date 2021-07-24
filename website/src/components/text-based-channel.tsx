import * as React from 'react';
import { fetchMessages } from '../redux/actions/message-actions';
import store from '../redux/store';
import Message from './message';
import MessageBox from './message-box';
import './text-based-channel.scoped.css';

export interface TextBasedChannelProps {
  channel: Entity.Channel;
}
export interface TextBasedChannelState {}
 
class TextBasedChannel extends React.Component<TextBasedChannelProps, TextBasedChannelState> {  
  get messages() {
    return store.getState().messages;
  }

  async componentWillMount() {
    fetchMessages(this.props.channel.id);
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
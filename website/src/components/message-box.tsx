import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import * as messageActions from '../redux/actions/message-actions';
import store from '../redux/store';
import './message-box.scoped.css';

export interface MessageBoxProps {}
export interface MessageBoxState {}
 

class MessageBox extends React.Component<MessageBoxProps, MessageBoxState> {  
  render() { 
    return (
      <div className="message-box block">
        <TextareaAutosize
          onKeyDown={this.create}
          className="color-normal appearance-none rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none" />
        <div className="message-box-footer"></div>
      </div>
    );
  }

  create = (event: any) => {
    if (event.key === 'Enter' || event.shiftKey) return;
    
    messageActions.createMessage({
      channelId: store.getState().activeChannelId,
      content: 'hi',
    });
  }
}
 
export default MessageBox;
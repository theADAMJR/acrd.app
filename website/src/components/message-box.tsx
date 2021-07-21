import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { MessageService } from '../services/message-service';
import { Deps } from '../utils/src/deps';
import './message-box.css';

export interface MessageBoxProps {}
export interface MessageBoxState {}
 
class MessageBox extends React.Component<MessageBoxProps, MessageBoxState> {
  constructor(
    private messageService = Deps.get<MessageService>(MessageService),
  ) { super({}); }
  
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
    event.persist();
    console.log(event.key); // this will return string of key name like 'Enter'
    alert('send')
  }
}
 
export default MessageBox;
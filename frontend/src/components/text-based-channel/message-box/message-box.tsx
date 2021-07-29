import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import * as messageActions from '../../store/actions/message-actions';
import './message-box.scoped.css';

export interface MessageBoxProps {}
 
const MessageBox: React.FunctionComponent<MessageBoxProps> = () => {
  const create = (event: any) => {
    if (event.key === 'Enter' || event.shiftKey) return;
    
    messageActions.createMessage({
      channelId: store.getState().activeChannel?.id as string,
      content: 'hi',
    });
  }
  
  return (
    <div className="message-box block">
      <TextareaAutosize
        onKeyDown={create}
        className="color-normal appearance-none rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none" />
      <div className="message-box-footer" />
    </div>
  );
}
 
export default MessageBox;

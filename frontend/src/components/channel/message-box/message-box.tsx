import { useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { createMessage } from '../../../store/messages';
import './message-box.scoped.css';

export interface MessageBoxProps {}
 
const MessageBox: React.FunctionComponent<MessageBoxProps> = () => {
  const dispatch = useDispatch();
  const { channelId }: any = useParams();
  const [content, setContent] = useState('');
  
  const create = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter'&& !event.shiftKey) { event.preventDefault(); }
    if (event.key !== 'Enter'
      || event.shiftKey
      || !content.replaceAll('\n', '')) return;
    
    dispatch(createMessage(channelId, { content }));
    setContent('');
  }
  
  // TODO: expand vertically
  return (
    <div className="message-box block">
      <TextareaAutosize
        onChange={e => setContent(e.target.value)}
        maxRows={1}
        onKeyDown={create}
        value={content}
        className="normal appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none"
        autoFocus />
      <div className="message-box-footer" />
    </div>
  );
}
 
export default MessageBox;

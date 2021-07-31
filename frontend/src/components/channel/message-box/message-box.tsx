import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { createMessage, updateMessage } from '../../../store/messages';
import { stoppedEditingMessage } from '../../../store/ui';

import './message-box.scoped.css';

export interface MessageBoxProps {
  content?: string;
  editingMessageId?: string;
}
 
const MessageBox: React.FunctionComponent<MessageBoxProps> = (props) => {
  const dispatch = useDispatch();
  const { channelId }: any = useParams();
  const [content, setContent] = useState(props.content ?? '');
  
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleEscape(event);
    
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); }
    if (event.key !== 'Enter'
      || event.shiftKey
      || !content.replaceAll('\n', '')) return;
    
    (props.editingMessageId)
      ? dispatch(updateMessage(props.editingMessageId, { content }))
      : dispatch(createMessage(channelId, { content }));
    setContent('');
    scrollToBottom();
    dispatch(stoppedEditingMessage());
  }

  // TODO: move to text-based-channel
  const scrollToBottom = () => {
    const element = document.querySelector('.messages')!;
    element.scrollTop = element.scrollHeight;
  }

  const handleEscape = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Escape') return;
    
    (props.editingMessageId)
      ? dispatch(stoppedEditingMessage())
      : scrollToBottom();
  }
  
  // TODO: expand vertically
  return (
    <div className={`message-box block ${!props.editingMessageId && 'p-4'}`}>
      <TextareaAutosize
        onChange={e => setContent(e.target.value)}
        maxRows={1}
        onKeyDown={onKeyDown}
        value={content}
        className="normal appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none"
        autoFocus />
      <div className="message-box-footer" />
    </div>
  );
}
 
export default MessageBox;

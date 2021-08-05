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
    const emptyMessage = content.replaceAll('\n', '');
    if (event.key !== 'Enter'
      || event.shiftKey
      || !emptyMessage) return;
    
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
    <div className={`flex-shrink-0 block ${!props.editingMessageId && 'px-4 h-16'}`}>
      <TextareaAutosize
        onChange={e => setContent(e.target.value)}
        maxRows={1}
        onKeyDown={onKeyDown}
        value={content}
        className="resize-none normal appearance-none rounded-lg leading-tight focus:outline-none w-full h-7 py-3 px-4 "
        autoFocus />
      {(props.editingMessageId)
        ? <span className="text-xs py-2">escape to cancel • enter to save</span>
        : <div className="w-full h-6" />
      }
    </div>
  );
}
 
export default MessageBox;

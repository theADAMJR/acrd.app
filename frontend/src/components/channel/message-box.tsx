import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { createMessage, updateMessage } from '../../store/messages';
import { stoppedEditingMessage } from '../../store/ui';

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
    
    if (event.key === 'Enter' && !event.shiftKey)
      event.preventDefault();

    const emptyMessage = content.replaceAll('\n', '');
    if (event.key !== 'Enter'
      || event.shiftKey
      || !emptyMessage) return;
    
    (props.editingMessageId)
      ? dispatch(updateMessage(props.editingMessageId, { content }))
      : dispatch(createMessage(channelId, { content }));
    setContent('');
    dispatch(stoppedEditingMessage());
  }

  const handleEscape = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Escape') return;
    if (props.editingMessageId)
      dispatch(stoppedEditingMessage());
  }
  
  return (
    <div className={`${!props.editingMessageId && 'px-4'}`}>
      <TextareaAutosize
        onChange={e => setContent(e.target.value)}
        onKeyDown={onKeyDown}
        value={content}
        rows={1}
        className="resize-none normal appearance-none rounded-lg leading-tight focus:outline-none w-full right-5 left-5 max-h-96 py-3 px-4"
        autoFocus />
      {(props.editingMessageId)
        ? <span className="text-xs py-2">escape to cancel • enter to save</span>
        : <div className="w-full h-6" />}
    </div>
  );
}
 
export default MessageBox;

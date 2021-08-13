import { useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { getTypersInChannel, startTyping } from '../../store/channels';
import { createMessage, updateMessage } from '../../store/messages';
import { stoppedEditingMessage } from '../../store/ui';
import { getUser } from '../../store/users';

export interface MessageBoxProps {
  content?: string;
  editingMessageId?: string;
}
 
const MessageBox: React.FunctionComponent<MessageBoxProps> = (props) => {
  const store = useStore();
  const dispatch = useDispatch();
  const [content, setContent] = useState(props.content ?? '');
  const channel = useSelector((s: Store.AppStore) => s.ui.activeChannel)!;
  const typers = useSelector(getTypersInChannel(channel.id));
  
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleEscape(event);
    dispatch(startTyping(channel.id));
    
    if (event.key === 'Enter' && !event.shiftKey)
      event.preventDefault();

    const emptyMessage = content.replaceAll('\n', '');
    if (event.key !== 'Enter'
      || event.shiftKey
      || !emptyMessage) return;
    
    (props.editingMessageId)
      ? dispatch(updateMessage(props.editingMessageId, { content }))
      : dispatch(createMessage(channel.id, { content }));
      
    setContent('');
    dispatch(stoppedEditingMessage());
  }

  const handleEscape = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Escape') return;
    if (props.editingMessageId)
      dispatch(stoppedEditingMessage());
  }

  const user = (userId: string) => getUser(userId)(store.getState());

  const typingMessage = () => {
    if (!typers.length) return;
  
    const maxTypers = 3;
    const typingUsers = typers.map(t => user(t.userId)!.username).join(', ');
    return (typers.length > maxTypers)
      ? 'Many users are typing...'
      : `${typingUsers} is typing...`
  }

  
  return (
    <div className={`${props.editingMessageId ? 'mt-2' : 'px-4'}`}>
      <TextareaAutosize
        onChange={e => setContent(e.target.value)}
        onKeyDown={onKeyDown}
        value={content}
        rows={1}
        placeholder={!props.editingMessageId ? `Message #${channel.name}` : ''}
        className="resize-none normal appearance-none rounded-lg leading-tight focus:outline-none w-full right-5 left-5 max-h-96 py-3 px-4"
        autoFocus />
      {(props.editingMessageId)
        ? <span className="text-xs py-2">escape to cancel • enter to save</span>
        : <div className="text-sm w-full h-6">{typingMessage()}</div>}
    </div>
  );
}
 
export default MessageBox;

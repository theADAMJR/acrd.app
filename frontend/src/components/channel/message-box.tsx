import { useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Link } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import usePerms from '../../hooks/use-perms';
import { createMessage, updateMessage } from '../../store/messages';
import { getTypersInChannel, startTyping } from '../../store/typing';
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
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const typers = useSelector(getTypersInChannel(channel.id));
  const perms = usePerms();
  
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleEscape(event);
    dispatch(startTyping(channel.id));
    
    if (event.key === 'Enter' && !event.shiftKey)
      event.preventDefault();

    const emptyMessage = content.replaceAll('\n', '');
    if (event.key !== 'Enter'
      || event.shiftKey
      || !emptyMessage) return;
    
    saveEdit();
  }

  const saveEdit = () => {
    (props.editingMessageId)
      ? dispatch(updateMessage(props.editingMessageId, { content }))
      : dispatch(createMessage(channel.id, { content }));
      
    setContent('');
    esc();
  }
  const esc = () => dispatch(stoppedEditingMessage());

  const handleEscape = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Escape') return;
    if (props.editingMessageId)
      esc();
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

  const canSend = perms.can('SEND_MESSAGES', guild.id);
  const getPlaceholder = (): string | undefined => {
    if (!canSend) return `Insufficient perms.`;
    if (!props.editingMessageId) return `Message #${channel.name}`;
  }
  
  return (
    <div className={`${props.editingMessageId ? 'mt-2' : 'px-4'}`}>
      <TextareaAutosize
        onChange={e => setContent(e.target.value)}
        onKeyDown={onKeyDown}
        value={content}
        rows={1}
        placeholder={getPlaceholder()}
        className="resize-none normal appearance-none rounded-lg leading-tight focus:outline-none w-full right-5 left-5 max-h-96 py-3 px-4"
        disabled={!canSend}
        autoFocus />
      {(props.editingMessageId)
        ? <span className="text-xs py-2">
            escape to <Link to="#" onClick={esc}>cancel</Link> • 
            enter to <Link to="#" onClick={saveEdit}> save</Link>
          </span>
        : <div className="text-sm w-full h-6">{typingMessage()}</div>}
    </div>
  );
}
 
export default MessageBox;

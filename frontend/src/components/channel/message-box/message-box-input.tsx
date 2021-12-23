import classNames from 'classnames';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { startTyping } from '../../../store/typing';
import { actions as ui } from '../../../store/ui';

interface MessageBoxInputProps {
  contentState: [any, any];
  saveEdit: () => any;
}
 
const MessageBoxInput: React.FunctionComponent<MessageBoxInputProps> = (props) => {
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const dispatch = useDispatch();
  const editingMessageId = useSelector((s: Store.AppState) => s.ui.editingMessageId);
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const perms = usePerms();
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = props.contentState;

  const onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {   
    if (event.key === 'Enter' && !event.shiftKey)      
      event.preventDefault();
    
    const text = event.currentTarget!.innerText.trim();
    setContent(text);

    handleEscape(event);
    dispatch(startTyping(channel.id));

    const emptyMessage = content.replaceAll('\n', '');
    if (event.key !== 'Enter'
      || event.shiftKey
      || !emptyMessage) return;
    
    props.saveEdit();

    setContent('');
    messageBoxRef.current!.innerText = '';
  }
  const handleEscape = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape')
      return ;
    if (editingMessageId)
      dispatch(ui.stoppedEditingMessage());
  }
  
  const canSend = perms.canInChannel('SEND_MESSAGES', guild.id, channel.id);
  const getPlaceholder = (): string | undefined => {
    if (!canSend) return `Insufficient perms.`;
    if (!editingMessageId) return `Message #${channel.name}`;
  }

  return (
    <div
      className={classNames(
        'resize-none normal rounded-lg appearance-none leading-tight',
        'focus:outline-none w-full right-5 left-5 max-h-96 py-3 px-4',
        { 'cursor-not-allowed': !canSend },
      )}>
      <div
        id="messageBox"
        className="focus:outline-none"
        ref={messageBoxRef}
        onKeyUp={onKeyUp}
        contentEditable={canSend}
        defaultValue={content}
        placeholder={getPlaceholder()} />
    </div>
  );
}

export default MessageBoxInput;
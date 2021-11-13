import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import useFormat from '../../../hooks/use-format';
import useMentions from '../../../hooks/use-mentions';
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
  const format = useFormat();
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const mentions = useMentions();
  const perms = usePerms();

  const [content, setContent] = props.contentState;
  
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const content = mentions.formatOriginal(event.currentTarget.innerText);
    setContent(content);

    handleEscape(event);
    dispatch(startTyping(channel.id));
    
    if (event.key === 'Enter' && !event.shiftKey)
      event.preventDefault();

    const emptyMessage = content.replaceAll('\n', '');
    if (event.key !== 'Enter'
      || event.shiftKey
      || !emptyMessage) return;
    
    props.saveEdit();
  }
  const handleEscape = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return;
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
      id="messageBox"
      className={classNames(
        'resize-none normal rounded-lg appearance-none leading-tight',
        'focus:outline-none w-full right-5 left-5 max-h-96 py-3 px-4',
        { 'cursor-not-allowed': !canSend },
      )}
      dangerouslySetInnerHTML={{ __html: format(content) }}
      onKeyDown={onKeyDown}
      onInput={setCaret}
      contentEditable={canSend}
      placeholder={getPlaceholder()} />
  );
}
 
function setCaret() {
  const el = document.querySelector('#messageBox')!;
  const range = document.createRange()!
  const sel = window.getSelection()!

  try {
    console.log(el.childNodes);

    range.setStart(el.childNodes[0], 3);
    range.collapse(true);
    
    sel.removeAllRanges();
    sel.addRange(range);
  } catch  (e){
    // console.log(e);
  }
}

export default MessageBoxInput;
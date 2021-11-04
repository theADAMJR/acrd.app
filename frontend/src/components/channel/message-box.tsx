import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Link } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import usePerms from '../../hooks/use-perms';
import { createMessage, updateMessage, uploadFileAsMessage } from '../../store/messages';
import { getTypersInChannel, startTyping } from '../../store/typing';
import { actions as ui } from '../../store/ui';
import { getUser } from '../../store/users';

export interface MessageBoxProps {
  content?: string;
  editingMessageId?: string;
  cachedContent?: Util.Dictionary;
  setCachedContent?: React.Dispatch<React.SetStateAction<Util.Dictionary>>;
}
 
const MessageBox: React.FunctionComponent<MessageBoxProps> = (props) => {
  const store = useStore();
  const dispatch = useDispatch();
  const [content, setContent] = useState(props.content ?? '');
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const typers = useSelector(getTypersInChannel(channel.id));
  const perms = usePerms();

  useEffect(() => {
    const messageBox = document.querySelector('#messageBox') as HTMLTextAreaElement;
    messageBox.value = props.cachedContent?.[channel.id] ?? content;
  }, [channel.id]);

  useEffect(() => {
    if (props.cachedContent && props.setCachedContent) {
      props.cachedContent[channel.id] = content;
      props.setCachedContent(props.cachedContent);
    }
  }, [content]);
  
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

  const esc = () => dispatch(ui.stoppedEditingMessage());
  const saveEdit = () => {
    (props.editingMessageId)
      ? dispatch(updateMessage(props.editingMessageId, { content }))
      : dispatch(createMessage(channel.id, { content }));
      
    setContent('');
    esc();
  }
  const handleEscape = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Escape') return;
    if (props.editingMessageId) esc();
  }

  const typingMessage = () => {
    if (!typers.length) return;
    
    const user = (userId: string) => getUser(userId)(store.getState());
  
    const maxTypers = 3;
    const typingUsers = typers.map(t => user(t.userId)!.username).join(', ');
    return (typers.length > maxTypers)
      ? 'Many users are typing...'
      : `${typingUsers} is typing...`;
  }

  const canSend = perms.canInChannel('SEND_MESSAGES', guild.id, channel.id);
  const getPlaceholder = (): string | undefined => {
    if (!canSend) return `Insufficient perms.`;
    if (!props.editingMessageId) return `Message #${channel.name}`;
  }

  // TODO: refactor
  const MessageBoxLeftSide = () => {
    const uploadInput = React.createRef<HTMLInputElement>();
    const onChange: any = (e: Event) => {
      const input = e.target as HTMLInputElement;   
      dispatch(uploadFileAsMessage(channel.id, { content }, input.files![0]));    
    }

    return (!props.editingMessageId) ? (
      <div className="px-4">
        <div className="relative">
          {/* TODO: add multiple file support */}
          <input
            ref={uploadInput}
            type="file"
            name="file"
            accept="image/*"
            onChange={onChange}
            hidden />
          <FontAwesomeIcon
            icon={faUpload}
            onClick={() => uploadInput.current?.click()}
            className="cursor-pointer z-1" />
        </div>
      </div>
    ) : null;
  } 
  
  return (
    <div className={`${props.editingMessageId ? 'mt-2' : 'px-4'}`}>
      <div className="rounded-lg bg-bg-secondary flex items-center">
        <MessageBoxLeftSide />
        <TextareaAutosize
          id="messageBox"
          onChange={e => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          value={content}
          rows={1}
          className={classNames(
            'resize-none normal rounded-lg appearance-none leading-tight',
            'focus:outline-none w-full right-5 left-5 max-h-96 py-3 px-4',
            { 'cursor-not-allowed': !canSend },
          )}
          placeholder={getPlaceholder()}
          disabled={!canSend}
          autoFocus />
      </div>
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

import { Util } from '@accord/types';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createMessage, updateMessage } from '../../../store/messages';
import { actions as ui } from '../../../store/ui';
import MessageBoxInput from './message-box-input';
import MessageBoxLeftSide from './message-box-left-side';
import TypingUsers from './typing-users';

export interface MessageBoxProps {
  content?: string;
  cachedContent?: Util.Dictionary;
  setCachedContent?: React.Dispatch<React.SetStateAction<Util.Dictionary>>;
}
 
const MessageBox: React.FunctionComponent<MessageBoxProps> = (props) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(props.content ?? '');
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const editingMessageId = useSelector((s: Store.AppState) => s.ui.editingMessageId);

  useEffect(() => {
    const messageBox = document.querySelector('#messageBox') as HTMLDivElement;
    messageBox.innerText = props.cachedContent?.[channel.id] ?? content;
  }, [channel.id]);

  useEffect(() => {
    if (props.cachedContent && props.setCachedContent) {
      props.cachedContent[channel.id] = content;
      props.setCachedContent(props.cachedContent);
    }
  }, [content]);

  const stopEditing = () => dispatch(ui.stoppedEditingMessage());
  const saveEdit = () => {
    (editingMessageId)
      ? dispatch(updateMessage(editingMessageId, { content }))
      : dispatch(createMessage(channel.id, { content }));
      
    setContent('');
    stopEditing();
  }
  
  return (
    <div className={(editingMessageId) ? 'mt-2' : 'px-4'}>
      <div className="rounded-lg bg-bg-secondary flex items-center">
        <MessageBoxLeftSide
          content={content}
          editingMessageId={editingMessageId}  />
        <MessageBoxInput
          contentState={[content, setContent]}
          saveEdit={saveEdit} />
      </div>
      <div className="text-sm w-full h-6">
      {(editingMessageId)
        ? <span className="text-xs py-2">
            escape to <Link to="#" onClick={stopEditing}>cancel</Link> • 
            enter to <Link to="#" onClick={saveEdit}> save</Link>
          </span>
        : <TypingUsers />}
      </div>
    </div>
  );
}

export default MessageBox;

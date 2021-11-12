import MessageBox from '../message-box';
import defaultPatterns from '../../../types/patterns';
import { FunctionComponent } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import striptags from 'striptags';
import { previewImage } from '../../../store/ui';
import { getUser } from '../../../store/users';
import useMentions from '../../../hooks/use-mentions';

interface MessageContentProps {
  message: Entity.Message;
}

const MessageContent: FunctionComponent<MessageContentProps> = ({ message }) => {
  const store = useStore();
  const dispatch = useDispatch();
  const mentions = useMentions();
  const editingMessageId = useSelector((s: Store.AppState) => s.ui.editingMessageId);

  

  // TODO: refactor to useMentions -> mention-service

  const messageHTML =
    ((message.content)
      ? format(mentions.toHTML(message.content))
      : ''
    ) + ((message.updatedAt && message.content)
      ? `<span
          class="select-none muted edited text-xs ml-1"
          title="${message.updatedAt}">(edited)</span>`
      : ''
    );

  const Attachments: React.FunctionComponent = () => (
    <>
      {message.attachmentURLs?.map(imageURL =>
        <img
          key={imageURL}
          style={{ maxWidth: '384px' }}
          className="my-2 cursor-pointer"
          onClick={() => dispatch(previewImage(imageURL))}
          src={process.env.REACT_APP_CDN_URL + imageURL}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `${process.env.REACT_APP_CDN_URL}/images/image-not-found.png`;
          }} />)}
    </>
  );
  
  return (editingMessageId === message.id)
    ? <MessageBox
        content={message.content}
        editingMessageId={message.id} />
    : <div className="relative">
        <div
          style={{maxWidth: '963px'}}
          className="normal whitespace-pre-wrap">
          <div
            dangerouslySetInnerHTML={{ __html: messageHTML }}
            className="overflow-auto"
            style={{ maxWidth: '100%' }} />
          <Attachments />
        </div>
      </div>;
}

export default MessageContent;
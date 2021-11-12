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

  const patterns = {
    boldItalic: /\*\*\*(.*?)\*\*\*/gs,
    bold: /\*\*(.*?)\*\*/gs,
    italic: /\*(.*?)\*|_(.*?)_/gs,
    underline: /__(.*?)__/gs,
    underlineItalics: /__\*(.*?)\*__/gs,
    underlineBold: /__\*\*(.*?)\*\*__/gs,
    underlineBoldItalics: /__\*\*\*(.*?)\*\*\*__/gs,
    strikethrough: /~~(.*?)~~/gs,
    codeMultiline: /```(.*?)```/gs,
    codeLine: /`(.*?)`/gs,
    blockQuoteMultiline: />>> (.*)/gs,
    blockQuoteLine: /^> (.*)$/gm,
    url: /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gm,
  }

  const format = (content: string) => content
    .replace(patterns.boldItalic, '<strong><em>$1</em></strong>')
    .replace(patterns.bold, '<strong>$1</strong>')
    .replace(patterns.italic, '<em>$1$2</em>')
    .replace(patterns.underline, '<u>$1</u>')
    .replace(patterns.underlineItalics, '<u><em>$1</em></u>')
    .replace(patterns.underlineBold, '<u><strong>$1</strong></u>')
    .replace(patterns.underlineBoldItalics, '<u><strong><em>$1</strong></em></u>')
    .replace(patterns.strikethrough, '<del>$1</del>')
    // FIXME: don't add message formatting in a code block
    .replace(patterns.codeMultiline, '<pre><code class="facade">$1</code></pre>')
    .replace(patterns.codeLine, '<code class="facade">$1</code>')
    .replace(patterns.blockQuoteLine, '<span class="blockquote pl-1">$1</span>')
    .replace(patterns.blockQuoteMultiline, '<div class="blockquote pl-1">$1</div>')
    .replace(defaultPatterns.url, '<a href="$1" target="_blank">$1</div>');

  // TODO: refactor to useMentions -> mention-service

  const messageHTML =
    ((message.content)
      ? format(mentions
        .tagsToHTML(
        striptags(mentions
        .stripFormat(message.content), mentions.tags)))
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
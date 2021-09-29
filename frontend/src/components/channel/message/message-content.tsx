import MessageBox from '../message-box';
import defaultPatterns from '../../../types/patterns';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

interface MessageContentProps {
  message: Entity.Message;
}

const MessageContent: FunctionComponent<MessageContentProps> = ({ message }) => {
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
    url: /http:\/\/(.*)|https:\/\//gm,
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
  
  return (editingMessageId === message.id)
  ? <MessageBox
      content={message.content}
      editingMessageId={message.id} />
  : <div className="relative">
      <div
        style={{maxWidth: '963px'}}
        className="normal whitespace-pre-wrap">
        <div
          dangerouslySetInnerHTML={{ __html: `${format(message.content)}` }}
          className="float-left overflow-auto"
          style={{ maxWidth: '100%' }} />
        {message.updatedAt && <span className="select-none muted edited text-xs ml-1">(edited)</span>}
      </div>
    </div>;
}

export default MessageContent;
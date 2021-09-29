import './message.scoped.css';
import './message.global.css';

import moment from 'moment';
import { useSelector } from 'react-redux';
import { getChannelMessages } from '../../../store/messages';
import { getUser } from '../../../store/users';
import MessageBox from '../message-box';
import MessageToolbar from './message-toolbar';
import { getMemberHighestRole } from '../../../store/roles';
import { getMember } from '../../../store/members';
import { ContextMenuTrigger } from 'react-contextmenu';
import MessageMenu from '../../ctx-menus/message-menu';
import classNames from 'classnames';
import hljs from 'highlight.js';

export interface MessageProps {
  message: Entity.Message;
}

const Message: React.FunctionComponent<MessageProps> = ({ message }: MessageProps) => {
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const member = useSelector(getMember(guild.id, message.authorId))!;
  const highestRole = useSelector(getMemberHighestRole(guild.id, member.userId));
  const author = useSelector(getUser(message.authorId));
  const messages = useSelector(getChannelMessages(message.channelId));
  const editingMessageId = useSelector((s: Store.AppState) => s.ui.editingMessageId);
  const createdAt = new Date(message.createdAt);

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
    .replace(patterns.blockQuoteLine,'<span class="blockquote pl-1">$1</span>')
    .replace(patterns.blockQuoteMultiline,'<div class="blockquote pl-1">$1</div>');

  const isExtra = () => {
    const i = messages.findIndex(m => m.id === message.id);
    const prev = messages[i - 1];
    if (!prev) return false;

    const minsSince = moment(createdAt).diff(prev.createdAt, 'minutes');    
    const minsToSeparate = 5;

    return minsSince <= minsToSeparate
        && prev.authorId === message.authorId;
  }
  const isActuallyExtra = isExtra();

  const leftSide = () => (isActuallyExtra)
    ? <span className="timestamp text-xs">
        {moment(createdAt).format('HH:mm')}
      </span>
    : <img
        className="rounded-full cursor-pointer w-10 h-10"
        src={`${process.env.REACT_APP_CDN_URL}${author.avatarURL}`}
        alt={author.username} />;
  
  const MessageHeader = () => {
    if (isActuallyExtra) return null;
  
    const toDays = (date: Date) => date.getTime() / 1000 / 60 / 60 / 24; 
    const midnight = new Date(new Date().setHours(0, 0, 0, 0));
    const daysAgo = Math.floor(toDays(midnight) - toDays(createdAt));
    
    const getTimestamp = () => {
      const wasToday = midnight.getDate() === createdAt.getDate();
      if (wasToday) return '[Today at] HH:mm';
      else if (daysAgo === 1) return '[Yesterday at] HH:mm';
      return 'DD/MM/YYYY';
    };

    return (
      <div>
        <ContextMenuTrigger id={author.id}>
          <span
            style={{ color: highestRole.color }}
            className="text-base heading hover:underline cursor-pointer mr-2">{author.username}</span>
        </ContextMenuTrigger>
        <span className="text-xs">{moment(createdAt).format(getTimestamp())}</span>
      </div>
    );
  }

  const MessageContent = () => (editingMessageId === message.id)
    ? <MessageBox
        content={message.content}
        editingMessageId={message.id} />
    : <div className="relative">
        <div className="normal whitespace-pre-wrap">
          <div
            dangerouslySetInnerHTML={{ __html: `${format(message.content)}` }}
            className="float-left" />
          {message.updatedAt && <span className="select-none muted edited text-xs ml-1">(edited)</span>}
        </div>
      </div>;

  return (
    <ContextMenuTrigger key={message.id} id={message.id}>
      <div className={classNames('message flex', { 'mt-4': !isActuallyExtra })}>
        <div className="flex-shrink-0 left-side text-xs w-16 mr-2 pl-5 pt-1">{leftSide()}</div>
        <div className="relative flex-grow px-2">
          <div className="absolute toolbar right-0 -mt-3 z-10">
            <MessageToolbar message={message} />
          </div>
          <MessageHeader />
          <MessageContent />
        </div>
        <div className="right-side w-12" />
      </div>
      <MessageMenu message={message} />
    </ContextMenuTrigger>
  );
}

export default Message;
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, getChannelMessages } from '../../store/messages';
import Message from './message/message';
import MessageBox from './message-box/message-box';
import { useEffect, useRef, useState } from 'react';
import TextChannelHeader from './text-channel-header';
import usePerms from '../../hooks/use-perms';
import SkeletonMessage from '../skeleton/skeleton-message';
import { Util } from '@accord/types';
 
const TextBasedChannel: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const messages = useSelector(getChannelMessages(channel.id));
  const perms = usePerms();
  const [cachedContent, setCachedContent] = useState<Util.Dictionary>({});
  const messagesRef = useRef<HTMLDivElement>(null);
  const msgCount = useSelector((s: Store.AppState) => s.entities.messages.total[channel.id]);
  
  const batchSize = 25;
  const loadedAllMessages = msgCount === messages.length;

  useEffect(() => {
    messagesRef.current!.scroll({
      top: messagesRef.current?.scrollHeight,
    });
  }, [messages[messages.length - 1]]);

  useEffect(() => {
    const messageBox = document.querySelector('#messageBox') as HTMLDivElement;
    messageBox.focus();
    
    dispatch(fetchMessages(channel.id, batchSize));
  }, [channel.id]);

  const onScroll = (e) => {
    if (messagesRef.current!.scrollTop > 0 || loadedAllMessages) return;

    const back = messages.length + batchSize;
    dispatch(fetchMessages(channel.id, back));
  }

  const canRead = perms.canInChannel('READ_MESSAGES', guild.id, channel.id);

  const LoadingIndicator: React.FunctionComponent = () => (
    <>
      {!(canRead && loadedAllMessages) &&
        new Array(!canRead ? 6 : 2)
          .fill(0)
          .map((_, i) => <SkeletonMessage key={i} />)}
    </>
  );

  return (
    <div className="h-full flex flex-col flex-grow">
      <div
        id="messages"
        ref={messagesRef}
        className="overflow-auto mb-5 mr-1 mt-1 flex-grow"
        onScroll={onScroll}>
        <TextChannelHeader canRead={canRead} />
        <LoadingIndicator />
        {canRead && messages.map(m => <Message key={m.id} message={m} />)}
      </div>
      <MessageBox
        cachedContent={cachedContent}
        setCachedContent={setCachedContent} />
    </div>
  );
}

export default TextBasedChannel;
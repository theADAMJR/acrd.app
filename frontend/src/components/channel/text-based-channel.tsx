import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, getChannelMessages } from '../../store/messages';
import Message from './message/message';
import MessageBox from './message-box';
import { useEffect } from 'react';
import TextChannelHeader from './text-channel-header';
import usePerms from '../../hooks/use-perms';
 
const TextBasedChannel: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const messages = useSelector(getChannelMessages(channel.id));
  const perms = usePerms();

  useEffect(() => {
    dispatch(fetchMessages(channel.id));

    const element = document.querySelector('#messages')!;
    element.scrollTop = element.scrollHeight;
  }, [messages.length]); // only fetches channel messages when not cached

  const loaded = channel.lastMessageId === messages[messages.length]?.id;
  const canRead = perms.can('READ_MESSAGES', guild.id);

  return (
    <div className="h-full flex flex-col flex-grow">
      <div
        id="messages"
        className="overflow-auto mb-5 mr-1 mt-1 flex-grow">
        <TextChannelHeader canRead={canRead} />
        {canRead && messages.map(m => <Message key={m.id} message={m} />)}
      </div>
      <MessageBox />
    </div>
  );
}

export default TextBasedChannel;
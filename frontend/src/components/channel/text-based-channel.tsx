import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, getChannelMessages } from '../../store/messages';
import Message from './message/message';
import MessageBox from './message-box';
import { useEffect } from 'react';
import TextChannelHeader from './text-channel-header';
 
const TextBasedChannel: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const channel = useSelector((s: Store.AppStore) => s.ui.activeChannel)!;
  const messages = useSelector(getChannelMessages(channel.id));

  useEffect(() => {
    dispatch(fetchMessages(channel.id));

    const element = document.querySelector('#messages')!;
    element.scrollTop = element.scrollHeight;
  }, [messages.length]); // only fetches channel messages when not cached

  
  return (
    <div className="h-full flex flex-col flex-grow">
      <div
        id="messages"
        className="overflow-auto mb-5 mr-1 mt-1 flex-grow">
        <TextChannelHeader />
        {messages.map(m => <Message key={m.id} message={m} />)}
      </div>
      <MessageBox />
    </div>
  );
}

export default TextBasedChannel;
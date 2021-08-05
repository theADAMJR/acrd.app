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
  }, [messages.length]); // only fetches channel messages when not cached
  
  return (
    <div className="text-based-channel flex flex-col flex-grow">
      <div className="messages overflow-auto mb-5 mr-1 mt-1 flex-grow">
        <TextChannelHeader />
        {messages.map(m => <Message key={m.id} message={m} />)}
      </div>
      <MessageBox />
    </div>
  );
}

export default TextBasedChannel;
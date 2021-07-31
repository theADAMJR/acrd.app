import { useSelector } from 'react-redux';
import { getChannelMessages } from '../../store/messages';
import Message from './message/message';
import MessageBox from './message-box/message-box';
import './text-based-channel.scoped.css';
 
const TextBasedChannel: React.FunctionComponent = () => {
  const channel = useSelector((s: Store.AppStore) => s.ui.activeChannel)!;  
  const messages = useSelector(getChannelMessages(channel.id));
  
  return (
    <div className="text-based-channel flex flex-col flex-grow">
      <div className="messages">
        {messages.map(m => <Message key={m.id} message={m} />)}
      </div>
      <MessageBox />
    </div>
  );
}

export default TextBasedChannel;
import { useStore } from 'react-redux';
import { getChannelMessages } from '../../store/messages';
import { getUser } from '../../store/users';
import Message from './message/message';
import MessageBox from './message-box/message-box';
import './text-based-channel.scoped.css';
 
const TextBasedChannel: React.FunctionComponent = () => {
  const state = useStore().getState();
  const channel = state.ui.activeChannel;
  const messages = getChannelMessages(channel.id)(state);
  
  return (
    <div className="text-based-channel flex flex-col flex-grow">
      <div className="messages">
        {messages.map(m => <Message
          key={m.id}
          author={getUser(m.authorId)(state)}
          message={m} />)}
      </div>
      <MessageBox />
    </div>
  );
}

export default TextBasedChannel;
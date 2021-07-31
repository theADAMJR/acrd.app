import { useSelector } from 'react-redux';
import { getChannelMessages } from '../../store/messages';
import Message from './message/message';
import MessageBox from './message-box/message-box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './text-based-channel.scoped.css';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
 
const TextBasedChannel: React.FunctionComponent = () => {
  const channel = useSelector((s: Store.AppStore) => s.ui.activeChannel)!;  
  const messages = useSelector(getChannelMessages(channel.id));
  const welcome = (
    <div className="m-4 pb-4 border-bottom">
      <span className="rounded-full heading">
        <FontAwesomeIcon icon={faHashtag} size="3x" />
      </span>
      <h1 className="text-3xl font-bold my-2">Welcome to #{channel.name}!</h1>
      <p className="lead">This is the start of the #{channel.name} channel.</p>
    </div>
  );
  
  return (
    <div className="text-based-channel flex flex-col flex-grow">
      <div className="messages">
        {!messages.length && welcome}
        {messages.map(m => <Message key={m.id} message={m} />)}
      </div>
      <MessageBox />
    </div>
  );
}

export default TextBasedChannel;
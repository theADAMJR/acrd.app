import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

const TextChannelHeader: React.FunctionComponent = () => {
  const channel = useSelector((s: Store.AppStore) => s.ui.activeChannel)!;
  
  return (
    <div className="m-4 pb-6 border-bottom">
      <span className="rounded-full">
        <FontAwesomeIcon
          className="muted"
          icon={faHashtag}
          size="3x" />
      </span>
      <h1 className="text-3xl font-bold my-2">Welcome to #{channel.name}!</h1>
      <p className="lead">This is the start of the #{channel.name} channel.</p>
    </div>
  );
}

export default TextChannelHeader;
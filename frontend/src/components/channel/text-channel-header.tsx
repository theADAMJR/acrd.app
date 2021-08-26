import { faEyeSlash, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

export interface TextChannelHeaderProps {
  canRead?: boolean;
}
 
const TextChannelHeader: React.FunctionComponent<TextChannelHeaderProps> = ({ canRead }) => {
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  
  return (
    <div className="m-4 pb-6 border-bottom">
      <span className="rounded-full">
        <FontAwesomeIcon
          className="muted"
          icon={canRead ? faHashtag : faEyeSlash}
          size="3x" />
      </span>
      <h1 className="text-3xl font-bold my-2">
        {(canRead)
          ? `Welcome to #${channel.name}!`
          : `Message history hidden.`
        }</h1>
      <p className="lead">
        {(canRead)
          ? `This is the start of the #${channel.name} channel.`
          : `Insufficient permissions to view messages in this channel.`
        }</p>
    </div>
  );
}

export default TextChannelHeader;
import { faEyeSlash, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

export interface TextChannelHeaderProps {
  canRead?: boolean;
}
 
const TextChannelHeader: React.FunctionComponent<TextChannelHeaderProps> = ({ canRead }) => {
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  
  return (
    <div className="flex m-4 pb-6 border-bottom justify-center">
      <div>
      <span className="flex justify-center rounded-full">
        <FontAwesomeIcon
          className="muted bg-bg-tertiary p-4 rounded-full"
          icon={canRead ? faHashtag : faEyeSlash}
          size="4x" />
      </span>
      <h1 className="text-3xl font-bold my-2 text-center">
        {(canRead)
          ? `This is #${channel.name}`
          : `Message history hidden.`
        }</h1>
      <p className="lead">
        {(canRead)
          ? `You have reached the top.`
          : `Insufficient permissions to view messages in this channel.`
        }</p>
      </div>
    </div>
  );
}

export default TextChannelHeader;
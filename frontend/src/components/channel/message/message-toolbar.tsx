import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMessage } from '../../../store/messages';
import { actions as ui } from '../../../store/ui';

export interface MessageToolbarProps {
  message: Entity.Message;
}
 
const MessageToolbar: React.FunctionComponent<MessageToolbarProps> = ({ message }) => {
  const dispatch = useDispatch();
  const selfUser = useSelector((s: Store.AppState) => s.auth.user)!;
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild);

  const isAuthor = message.authorId === selfUser.id;
  const canManage = guild?.ownerId === selfUser.id || isAuthor;
  
  return (
    <div className="float-right shadow bg-bg-secondary px-2 rounded cursor-pointer">
      {isAuthor && <div className="inline">
        <FontAwesomeIcon
          onClick={() => dispatch(ui.startedEditingMessage(message.id))}
          className="mr-2"
          icon={faPencilAlt} />
        </div>}
      {canManage && <div className="inline">
        <FontAwesomeIcon
        onClick={() => dispatch(deleteMessage(message.id))}
        className="danger"
        icon={faTimes} />
      </div>}
    </div>
  );
}
 
export default MessageToolbar;
import { Entity } from '@accord/types';
import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { deleteMessage } from '../../../store/messages';
import { actions as ui } from '../../../store/ui';

export interface MessageToolbarProps {
  message: Entity.Message;
}
 
const MessageToolbar: React.FunctionComponent<MessageToolbarProps> = ({ message }) => {
  const dispatch = useDispatch();
  const selfUser = useSelector((s: Store.AppState) => s.auth.user)!;
  const guild = useSelector((s: Store.AppState) => s.ui.activeGuild)!;
  const openModal = useSelector((s: Store.AppState) => s.ui.openModal);
  const perms = usePerms();

  const isAuthor = message.authorId === selfUser.id;
  const canManage = perms.canInChannel('MANAGE_MESSAGES', guild.id, message.channelId)
    || guild?.ownerId === selfUser.id
    || isAuthor;
  
  return (!openModal) ? (
    <div className="float-right shadow bg-bg-secondary px-2 rounded cursor-pointer">
      {isAuthor && (
        <div className="inline">
          <FontAwesomeIcon
            onClick={() => dispatch(ui.startedEditingMessage(message.id))}
            className="mr-2"
            icon={faPencilAlt} />
        </div>
      )}
      {canManage && (
        <div className="inline">
          <FontAwesomeIcon
          onClick={() => dispatch(deleteMessage(message.id))}
          className="danger"
          icon={faTimes} />
        </div>
      )}
    </div>
  ) : null;
}
 
export default MessageToolbar;
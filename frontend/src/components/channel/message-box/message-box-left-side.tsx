import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePerms from '../../../hooks/use-perms';
import { uploadFileAsMessage } from '../../../store/messages';

interface MessageBoxLeftSideProps {
  content: string;
  editingMessageId?: string;
}

const MessageBoxLeftSide: React.FunctionComponent<MessageBoxLeftSideProps> = (props) => {
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const dispatch = useDispatch();
  const perms = usePerms();

  const uploadInput = React.createRef<HTMLInputElement>();
  const onChange: any = (e: Event) => {
    const input = e.target as HTMLInputElement;
    dispatch(uploadFileAsMessage(channel.id, { content: props.content }, input.files![0]));
  }

  const canSendFiles = perms.canInChannel('SEND_FILES', channel.guildId, channel.id);

  return (!props.editingMessageId) ? (
    <div className={classNames('px-4')}>
      <div className="relative">
        <input
          disabled={!canSendFiles}
          ref={uploadInput}
          type="file"
          name="file"
          accept="image/*"
          onChange={onChange}
          hidden />
        <FontAwesomeIcon
          color={canSendFiles ? '#ffffff' : 'var(--muted)'}
          icon={faUpload}
          onClick={() => uploadInput.current?.click()}
          className={classNames('cursor-pointer z-1')} />
      </div>
    </div>
  ) : null;
}
export default MessageBoxLeftSide;
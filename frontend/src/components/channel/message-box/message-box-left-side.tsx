import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFileAsMessage } from '../../../store/messages';

interface MessageBoxLeftSideProps {
  content: string;
  editingMessageId?: string;
}

const MessageBoxLeftSide: React.FunctionComponent<MessageBoxLeftSideProps> = (props) => {
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const dispatch = useDispatch();

  const uploadInput = React.createRef<HTMLInputElement>();
  const onChange: any = (e: Event) => {
    const input = e.target as HTMLInputElement;
    dispatch(uploadFileAsMessage(channel.id, { content: props.content }, input.files![0]));    
  }

  return (!props.editingMessageId) ? (
    <div className="px-4">
      <div className="relative">
        <input
          ref={uploadInput}
          type="file"
          name="file"
          accept="image/*"
          onChange={onChange}
          hidden />
        <FontAwesomeIcon
          icon={faUpload}
          onClick={() => uploadInput.current?.click()}
          className="cursor-pointer z-1" />
      </div>
    </div>
  ) : null;
}
export default MessageBoxLeftSide;
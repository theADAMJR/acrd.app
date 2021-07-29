import { useDispatch, useStore } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { createMessage } from '../../../store/messages';
import './message-box.scoped.css';

export interface MessageBoxProps {}
 
const MessageBox: React.FunctionComponent<MessageBoxProps> = () => {
  const dispatch = useDispatch();
  const state = useStore().getState();
  
  const create = (event: any) => {
    if (event.key === 'Enter' || event.shiftKey) return;
    
    dispatch(createMessage(
      state.ui.activeChannel.id,
      { content: 'hi' },
    ));
  }
  
  return (
    <div className="message-box block">
      <TextareaAutosize
        onKeyDown={create}
        className="color-normal appearance-none rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none" />
      <div className="message-box-footer" />
    </div>
  );
}
 
export default MessageBox;

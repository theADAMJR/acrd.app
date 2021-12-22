import { Entity } from '@accord/types';
import moment from 'moment';
import { FunctionComponent } from 'react';

interface MessageTimestampProps {
  message: Entity.Message;
}
 
const MessageTimestamp: FunctionComponent<MessageTimestampProps> = ({ message }) => {
  const toDays = (date: Date) => date.getTime() / 1000 / 60 / 60 / 24; 

  const createdAt = new Date(message.createdAt);
  const midnight = new Date(new Date().setHours(0, 0, 0, 0));
  const daysAgo = Math.floor(toDays(midnight) - toDays(createdAt));

  function getTimestamp() {
    const wasToday = midnight.getDate() === createdAt.getDate();
    if (wasToday) return '[Today at] HH:mm';
    else if (daysAgo === 1) return '[Yesterday at] HH:mm';
    return 'DD/MM/YYYY';
  }
  return <span>{moment(createdAt).format(getTimestamp())}</span>;
}

export default MessageTimestamp;
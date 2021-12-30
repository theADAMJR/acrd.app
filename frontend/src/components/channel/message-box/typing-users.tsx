import { useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { getTypersInChannel } from '../../../store/typing';
import { getUser } from '../../../store/users';

const TypingUsers: React.FunctionComponent = () => {
  const store = useStore();
  const selfUser = useSelector((s: Store.AppState) => s.auth.user)!;
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const notSelf = (t) => t.userId !== selfUser.id;
  const typers = useSelector(getTypersInChannel(channel.id)).filter(notSelf);
  const [dots, setDots] = useState('.');

  if (!typers.length) return null;
  
  const user = (userId: string) => getUser(userId)(store.getState());

  const maxTypers = 3;
  const typingUsers = typers
    .map(t => user(t.userId)!.username)
    .join(', ');

  setTimeout(() => {
    (dots.length >= 3)
      ? setDots('.')
      : setDots(dots + '.');
  }, 500);

  return (
    <span className="pl-2">
      {(typers.length > maxTypers)
        ? `Many users are typing${dots}`
        : `${typingUsers} is typing${dots}`}
    </span>
  );
}

export default TypingUsers;
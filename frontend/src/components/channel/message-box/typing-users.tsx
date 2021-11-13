import { useSelector, useStore } from 'react-redux';
import { getTypersInChannel } from '../../../store/typing';
import { getUser } from '../../../store/users';

const TypingUsers: React.FunctionComponent = () => {
  const store = useStore();
  const channel = useSelector((s: Store.AppState) => s.ui.activeChannel)!;
  const typers = useSelector(getTypersInChannel(channel.id));

  if (!typers.length) return null;
  
  const user = (userId: string) => getUser(userId)(store.getState());

  const maxTypers = 3;
  const typingUsers = typers
    .map(t => user(t.userId)!.username)
    .join(', ');

  return (
    <span>
      {(typers.length > maxTypers)
        ? 'Many users are typing...'
        : `${typingUsers} is typing...`}
    </span>
  );
}

export default TypingUsers;
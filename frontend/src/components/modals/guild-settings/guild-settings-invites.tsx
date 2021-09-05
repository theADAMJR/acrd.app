import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getGuildInvites } from '../../../store/guilds';
import { deleteInvite } from '../../../store/invites';
import { openSaveChanges } from '../../../store/ui';
import CircleButton from '../../utils/buttons/circle-button';

const GuildSettingsInvites: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { guildId }: any = useParams();
  const invites = useSelector(getGuildInvites(guildId));
  
  const Invites = () => (<>
    {invites.map(i => (
      <div className="w-full">
        <strong>{i.id}</strong>
        <span className="float-right">
          <CircleButton
            onClick={() => dispatch(deleteInvite(i.id))}
            style={{ color: 'var(--danger)' }}>x</CircleButton>
        </span>
      </div>
    ))}
    {!invites.length && <span>No invites created.</span>}
  </>);
  
  return (
    <form
      onChange={() => dispatch(openSaveChanges(true))}
      className="flex flex-col pt-14 px-10 pb-20 h-full mt-1">
      <header>
        <h1 className="text-xl font-bold inline">Invites</h1>
      </header>
    
      <Invites />
    </form>    
  );
}
 
export default GuildSettingsInvites;
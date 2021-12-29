import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getGuildInvites } from '../../../store/guilds';
import { deleteInvite } from '../../../store/invites';
import { openSaveChanges } from '../../../store/ui';

const GuildSettingsInvites: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { guildId }: any = useParams();
  const invites = useSelector(getGuildInvites(guildId));
  
  const Invites = () => (
    <div className="mt-2">
      {invites.map(i => (
        <div className="w-full mb-3">
          <strong>{i.id}</strong>
          <span className="float-right">
            <button
              type="button"
              className="danger rounded-full border-2 border-danger px-2"
              onClick={() => dispatch(deleteInvite(i.id))}>x</button>
          </span>
        </div>
      ))}
      {!invites.length && <span>No invites created.</span>}
    </div>
  );
  
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
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchGuildInvites, getGuild, getGuildInvites, getGuildUsers } from '../../../store/guilds';
import { deleteInvite } from '../../../store/invites';
import { openSaveChanges } from '../../../store/ui';
import Username from '../../user/username';
import CircleButton from '../../utils/buttons/circle-button';
import './guild-settings-invites.scoped.css';

const GuildSettingsInvites: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { guildId }: any = useParams();
  const invites = useSelector(getGuildInvites(guildId));
  const guild = useSelector(getGuild(guildId));
  const guildUsers = useSelector(getGuildUsers(guildId));

  dispatch(fetchGuildInvites(guildId));

  const Invites = () => (
    <div className="mt-2">
      {invites.filter(x => x).map(i => (
        <div className="flex align-center justify-between invite w-full p-2">
          <code className='font-bold pt-2'>{i.id}</code>
          <span className="ml-4 secondary">
            <span className='ml-4'>Used <code>{i.uses}</code> times</span>
          </span>
          <span className='ml-4'>Created by
            <Username
              size='sm'
              user={guildUsers.find(gu => gu.id == i.inviterId)}
              guild={guild} />
          </span>
          <span className="justify-end">
            <CircleButton
              type="button"
              style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
              onClick={() => dispatch(deleteInvite(i.id))}>X</CircleButton>
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
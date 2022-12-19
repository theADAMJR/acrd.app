import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchGuildInvites, getGuild, getGuildInvites, getGuildUsers } from '../../../store/guilds';
import { deleteInvite } from '../../../store/invites';
import { openSaveChanges } from '../../../store/ui';
import FoundUsername from '../../user/username';
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
    <table className="mt-2">
      <tr>
        <th>Code</th>
        <th>Used</th>
        <th>Creator</th>
      </tr>
      {invites.map(i => (
        <tr key={i.code} className="invite">
          <td><code className='font-bold primary'>{i.id}</code></td>
          <td><code className='tertiary'>{i.uses}</code> times</td>
          <td>
            <FoundUsername
              size='sm'
              className='h-full'
              user={guildUsers.find(gu => gu.id == i.inviterId)}
              guild={guild} />
          </td>
          <td className='w-0'>
            <CircleButton
              type="button"
              style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
              onClick={() => dispatch(deleteInvite(i.id))}>X</CircleButton>
          </td>
        </tr>
      ))}
      {!invites.length && <span>No invites created.</span>}
    </table>
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
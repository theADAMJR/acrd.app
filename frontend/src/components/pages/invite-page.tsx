import { Entity } from '@accord/types';
import { useEffect } from 'react';
import Particles from 'react-particles-js';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import fetchEntities from '../../store/actions/fetch-entities';
import { getGuild, getGuildMembers } from '../../store/guilds';
import { fetchInvite, getInvite } from '../../store/invites';
import { joinGuild } from '../../store/members';
import { getTag, getUser } from '../../store/users';
import SidebarIcon from '../navigation/sidebar/sidebar-icon';
import NormalButton from '../utils/buttons/normal-button';
import PageWrapper from './page-wrapper';

interface InvitePageProps {}
 
const InvitePage: React.FunctionComponent<InvitePageProps> = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { inviteId }: any = useParams();
  const invite: Entity.Invite = useSelector(getInvite(inviteId));
  const guild: Entity.Guild | undefined = useSelector(getGuild(invite?.guildId)); 

  const members: Entity.GuildMember[] = useSelector(getGuildMembers(invite?.guildId));
  const ownerUser: Entity.User = useSelector(getUser(guild!?.ownerId));

  useEffect(() => {
    dispatch(fetchInvite(inviteId));
    if (invite) dispatch(fetchEntities([invite.guildId]));
  }, []);

  if (!invite) return <div>Invalid Invite: Invite not found</div>;
  if (!guild) return <div>Invalid Invite: Guild not found</div>;

  return (
    <PageWrapper pageTitle={`accord.app | Invite to '${guild.name}'`}>
      <div className="flex items-center absolute justify-center h-screen left-[35%]">
        <section className="rounded-md shadow bg-bg-primary p-8 w-[478px]">
          <h1 className="text-3xl font-bold">You have been invited to {guild.name}!</h1>
          <div className="flex mt-5">
            <SidebarIcon
              name={guild.name}
              imageURL={guild.iconURL}
              childClasses="bg-bg-tertiary w-24 h-24 pt-6 text-xl"
              disableHoverEffect />
            <div className="flex justify-around w-full mx-5">
              <span>
                <strong className="heading">Members</strong>: <code className="muted">{members.length}</code>
              </span>
              <span>
                <strong className="heading">Owner</strong>: <code className="muted">{getTag(ownerUser)}</code>
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-5 mx-5 mt-5">
            <NormalButton
              onClick={() => {
                dispatch(joinGuild(inviteId));
                history.push(`/channels/${invite.guildId}`);
              }}
              className="bg-success light">Join :D</NormalButton>
            <Link to="/">
              <NormalButton className="bg-danger light">Nope :(</NormalButton>
            </Link>
          </div>
        </section>
      </div>
      <Particles width="100%" height="100%" />
    </PageWrapper>
  );
}
 
export default InvitePage;
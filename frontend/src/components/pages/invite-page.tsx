import { Entity } from '@acrd/types';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import fetchEntities from '../../store/actions/fetch-entities';
import { getGuild, getGuildMembers } from '../../store/guilds';
import { fetchInvite, getInvite } from '../../store/invites';
import { joinGuild } from '../../store/members';
import { getTag, getUser } from '../../store/users';
import SidebarIcon from '../navigation/sidebar/sidebar-icon';
import FoundUsername from '../user/username';
import NormalButton from '../utils/buttons/normal-button';
import FullParticles from '../utils/full-particles';
import PageWrapper from './page-wrapper';

interface InvitePageProps { }

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

  const Wrapper: React.FunctionComponent = ({ children }) => (
    <PageWrapper pageTitle={`acrd.app | Invite to '${guild?.name}'`}>
      <div className="flex items-center absolute justify-center h-screen left-[35%]">
        <section className="rounded-md shadow bg-bg-primary p-8 w-[478px]">
          {children}
        </section>
      </div>
    </PageWrapper>
  );

  const NotFoundIcon = () => (
    <FontAwesomeIcon
      className="float-left mr-2"
      color="var(--warning)"
      icon={faSearchLocation}
      size="2x" />
  );

  if (!invite || !guild)
    return (
      <Wrapper>
        <NotFoundIcon />
        <h1 className="text-xl font-bold warning">Invite not found...</h1>
        <p className="lead">The invite either has expired, or never existed.</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <FullParticles />
      <h1 className="text-3xl font-bold text-center">You have been invited to {guild.name}!</h1>
      <div className="flex mt-5">
        <SidebarIcon
          name={guild.name}
          imageURL={guild.iconURL}
          childClasses="bg-bg-tertiary w-24 h-24 pt-6 text-xl"
          disableHoverEffect />
        <div className="flex justify-around items-center w-full mx-5">
          <span className='text-center'>
            <div className="heading font-bold text-center">Members</div>
            <code>{members.length}</code>
          </span>
          <span className='text-center'>
            <div className="heading font-bold">Owned By</div>
            <FoundUsername user={ownerUser} />
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-5 mx-5 mt-5">
        <NormalButton
          onClick={() => {
            dispatch(joinGuild(inviteId));
            history.push(`/channels/${invite.guildId}`);
          }}
          className="bg-success dark">Join</NormalButton>
        <Link to="/">
          <NormalButton className="bg-danger light">Cancel</NormalButton>
        </Link>
      </div>
    </Wrapper>
  );
}

export default InvitePage;
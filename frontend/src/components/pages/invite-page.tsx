import { Entity } from '@accord/types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchGuild, getGuild } from '../../store/guilds';
import { fetchInvite, getInvite } from '../../store/invites';
import Navbar from '../navigation/navbar';
import PageWrapper from './page-wrapper';

interface InvitePageProps {}
 
const InvitePage: React.FunctionComponent<InvitePageProps> = () => {
  const dispatch = useDispatch();
  const { inviteId }: any = useParams();
  const invite = useSelector(getInvite(inviteId));
  const guild = useSelector(getGuild(invite?.guildId)); 

  useEffect(() => {
    dispatch(fetchInvite(inviteId));
    if (invite) dispatch(fetchGuild(invite.guildId));
  }, []);

  if (!invite) return <div>Invalid Invite: Invite not found</div>;
  if (!guild) return <div>Invalid Invite: Guild not found</div>;

  return (guild) ? (
    <PageWrapper
      className="z-10 bg-bg-tertiary h-screen relative"
      pageTitle="accord.app | Like Discord but Cooler">
      <div className="flex items-center absolute justify-center h-screen">
        <section className="flex justify-center items-center h-1/2">
          <h1>You have been invited to {guild.name}</h1>
        </section>
      </div>
    </PageWrapper>
  ) : null;
}
 
export default InvitePage;
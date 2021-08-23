import { Mock } from '../../mock/mock';
import Deps from '../../../src/utils/deps';
import { API } from '../../../src/api/server';
import request from 'supertest';
import Users from '../../../src/data/users';
import { UserDocument } from '../../../src/data/models/user';
import { InviteDocument } from '../../../src/data/models/invite';
import { GuildDocument } from '../../../src/data/models/guild';

describe('invite-routes', () => {
  const endpoint = `/api/v1/invites`;

  let app: Express.Application;
  let users: Users;
  let user: UserDocument;
  let authorization: string;
  let invite: InviteDocument;
  let guild: GuildDocument;

  beforeEach(async () => {
    app = Deps.get<API>(API).app;
    users = Deps.get<Users>(Users);

    guild = await Mock.guild();
    user = await users.get(guild.ownerId);
    invite = await Mock.invite(guild.id);

    authorization = `Bearer ${users.createToken(user.id)}`;
  });

  afterEach(async () => await Mock.cleanDB());
  
  it('GET /:id, invite not found, 404', async () => {
    await invite.deleteOne();

    await request(app)
      .get(`${endpoint}/${invite.id}`)
      .expect(404)
      .expect({ message: 'Invite Not Found' });
  });
  
  it('GET /:id, invite found, returns invite', async () => {
    await request(app)
      .get(`${endpoint}/${invite.id}`)
      .expect(200)
      .expect(invite.toJSON());
  });
});

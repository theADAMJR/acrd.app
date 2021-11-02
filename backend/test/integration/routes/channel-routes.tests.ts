import { Mock } from '../../mock/mock';

import { API } from '../../../src/api/server';
import request from 'supertest';
import Users from '../../../src/data/users';
import { UserDocument } from '../../../src/data/models/user';
import { expect } from 'chai';
import { GuildDocument } from '../../../src/data/models/guild';

describe('channel-routes', () => {
  const endpoint = `/api/v1/channels`;

  let app: Express.Application;
  let authorization: string;
  let users: Users;
  let user: UserDocument;
  let channel: Entity.Channel;
  let guild: GuildDocument;

  beforeEach(async () => {
    app = deps.rest.app;
    users = deps.users;

    guild = await Mock.guild();
    channel = guild.channels[0];
    user = await users.get(guild.ownerId);

    authorization = `Bearer ${await users.createToken(user.id)}`;
  });

  afterEach(async () => await Mock.cleanDB());
  
  it('GET /, returns text and dm channels', async () => {
    await Mock.channel({
      userIds: [user.id, guild.ownerId],
      type: 'DM',
    });
    
    await request(app)
      .get(endpoint)
      .set('Authorization', authorization)
      .expect(200)
      .expect(res => expect(res.body.length).to.equal(2));
  });
  
  it('GET /:channelId/messages, returns messages', async () => {
    const channel = guild.channels[0];
    
    await request(app)
      .get(`${endpoint}/${channel.id}/messages`)
      .set('Authorization', authorization)
      .expect(200)
      .expect(res => expect(res.body.length).to.equal(2));
  });
  
  it('GET /:channelId/messages, returns batch size of most recent messages', async () => {
    const messages = [];
    for (let i = 0; i < 50; i++)
      messages.push(await Mock.message(user, channel.id));
    
    await request(app)
      .get(`${endpoint}/${channel.id}/messages`)
      .set('Authorization', authorization)
      .expect(200)
      .expect(res => expect(res.body[0].id).to.equal(messages[25].id));
  });
  
  it('GET /:channelId/messages, batch size 1, returns last message', async () => {
    const message = await Mock.message(user, channel.id)
    
    await request(app)
      .get(`${endpoint}/${channel.id}/messages?back=1`)
      .set('Authorization', authorization)
      .expect(200)
      .expect(res => expect(res.body[0].id).to.equal(message.id));
  });

  // TODO: test that blocked author messages are not shown
  // TODO: test has ability to read messages in channel 
});

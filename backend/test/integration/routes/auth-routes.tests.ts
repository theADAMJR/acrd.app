import { Mock } from '../../mock/mock';
import { EmailMock } from '../../mock/email-mock';
import { assert, expect, spy } from 'chai';
import Deps from '../../../src/utils/deps';
import request from 'supertest';
import Users from '../../../src/data/users';
import { User, SelfUserDocument } from '../../../src/data/models/user';
import { generateUsername } from '../../../src/utils/utils';
import { REST } from '../../../src/rest/server';

describe.skip('auth-routes', () => {
  const endpoint = `/api/v1`;

  let app: Express.Application;
  let users: Users;
  let credentials: { username?, password?, email? };
  let user: SelfUserDocument;
  let email: EmailMock;
  let authorization: string;

  beforeEach(async () => {    
    email = Deps.add(Email, new EmailMock());

    app = Deps.get<REST>(REST).app;
    users = Deps.get<Users>(Users);

    credentials = {
      email: 'testing123@example.com',
      username: generateUsername(),
      password: 'Testing@123',
    };
    user = await users.create({
      email: credentials.email,
      password: credentials.password,
      username: credentials.username,
    }) as any;
    credentials.email = user.email; 

    authorization = `Bearer ${await users.createToken(user.id)}`;
  });

  afterEach(async () => await Mock.cleanDB());

  it('POST /login, invalid username and password, invalid credentials', async () => {    
    await request(app)
      .post(`${endpoint}/login`)
      .expect(400);
  });
  
  it('POST /login, email used is unverified', async () => {
    delete credentials.username;

    await request(app)
      .post(`${endpoint}/login`)
      .send(credentials)
      .expect(400)
      .expect({ message: 'Email is unverified' });
  });
  
  it('POST /login, valid username and password, unverified user, sends jwt', async () => {
    delete credentials.email;

    await request(app)
      .post(`${endpoint}/login`)
      .send(credentials)
      .expect(200)
      .expect(res => assert(
        typeof res.body === 'string',
        'User token should be returned.',
      ));
  });
  
  it('POST /login, verified email, sends email', async () => {
    user.verified = true;
    await user.save();

    const send = spy.on(email, 'send');
    
    await request(app)
      .post(`${endpoint}/login`)
      .send(credentials);
    
    expect(send).to.have.been.called.with('verify');
  });
  
  it('POST /change-password, no email provided, user not found', async () => {
    await request(app)
      .post(`${endpoint}/change-password`)
      .send({
        newPassword: 'a',
        oldPassword: 'b'
      })
      .expect(400)
      .expect({
        message: 'User not found'
      });
  });
  
  it('POST /change-password, old password incorrect, 400', async () => {
    await request(app)
      .post(`${endpoint}/change-password`)
      .send({
        email: user.email,
        newPassword: 'a',
        oldPassword: 'b'
      })
      .expect(400);
  });
  
  it('POST /change-password, old password correct, sends jwt', async () => {
    await request(app)
      .post(`${endpoint}/change-password`)
      .send({
        email: user.email,
        newPassword: credentials.password,
        oldPassword: generateInviteCode(),
      })
      .expect(200)
      .expect(res => assert(
        typeof res.body === 'string',
        'User token should be returned.',
      ));
  });

  it('POST /change-password, new password equals old, 400', async () => {
    await request(app)
      .post(`${endpoint}/change-password`)
      .send({
        email: user.email,
        newPassword: credentials.password,
        oldPassword: credentials.password,
      })
      .expect(400)
      .expect({ message: 'New password must be different' });
  });

  it('GET /verify-code, invalid code', async () => {
    await request(app)
    .get(`${endpoint}/verify-code`)
      .query({ code: '1234' })
      .expect(400)
      .expect({ message: 'Invalid code' });
  });

  it('GET /verify-code, valid code, returns key', async () => {
    await request(app)
      .post(`${endpoint}/login`)
      .send(credentials);    

    const code = email.emails.get([user.email])[1].code;

    await request(app)
      .get(`${endpoint}/verify-code`)
      .query({ code })
      .expect(200)
      .expect(res => assert(
        typeof res.body === 'string',
        'User token should be returned.',
      ));
  });

  it('GET /send-verify-email, email not provided', async () => {
    await request(app)
      .get(`${endpoint}/send-verify-email`)
      .set('Authorization', authorization)
      .expect(400)
      .expect({ message: 'Email not provided' });
  });

  it('GET /send-verify-email, email is sent', async () => {
    const send = spy.on(email, 'send');

    await request(app)
      .get(`${endpoint}/send-verify-email`)
      .set('Authorization', authorization)
      .query({ email: user.email });

    expect(send).to.have.been.called.with('verify-email');
  });

  it('GET /send-verify-email, sets user email', async () => {
    const newEmail = 'adam@d-cl.one';

    await request(app)
      .get(`${endpoint}/send-verify-email`)
      .set('Authorization', authorization)
      .query({ email: newEmail });

    user = await User.findById(user.id) as SelfUserDocument;
    expect(user.email).to.equal(newEmail);
  });

  it('GET /verify-email, invalid code', async () => {
    await request(app)
      .get(`${endpoint}/verify-email`)
      .expect(400)
      .expect({ message: 'Invalid code' });
  });

  it('GET /verify-email, valid code, email updated', async () => {
    await request(app)
      .get(`${endpoint}/send-verify-email`)
      .set('Authorization', authorization)
      .query({ email: user.email });

    const code = email.emails.get([user.email])[1];

    await request(app)
      .get(`${endpoint}/verify-email`)
      .query({ code })
      .expect(302);
  });
});

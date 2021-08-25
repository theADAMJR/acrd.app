import { Router } from 'express';
import { User } from '../../data/models/user';
import passport from 'passport';
import Deps from '../../utils/deps';
import Users from '../../data/users';
import { Verification } from '../modules/email/verification';
import { EmailFunctions } from '../modules/email/email-functions';
import { APIError } from '../modules/api-error';
import { WebSocket } from '../../ws/websocket';
import Channels from '../../data/channels';

export const router = Router();

const channels = Deps.get<Channels>(Channels);
const sendEmail = Deps.get<EmailFunctions>(EmailFunctions);
const users = Deps.get<Users>(Users);
const verification = Deps.get<Verification>(Verification);
const ws = Deps.get<WebSocket>(WebSocket);

router.post('/login', passport.authenticate('local', { failWithError: true }),
  async (req, res) => {
    const user = await users.getByEmail(req.body.email);
    if (!user)
      throw new APIError(400, 'Invalid credentials');
    else if (user.locked)
      throw new TypeError('This account is locked');

    await sendEmail.verifyCode(user as any);
    res.status(200).json(users.createToken(user.id));
  });

router.post('/register', async (req, res) => {
  const user = await users.create({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  });

  res.status(201).json(users.createToken(user.id));
});

router.get('/verify-code', async (req, res) => {
  const email = verification.getEmailFromCode(req.query.code as any);
  const user = await User.findOne({ email }) as any;
  if (!email || !user)
    throw new APIError(400, 'Invalid code');

  verification.delete(email);

  const code = verification.get(req.query.code as string);
  if (code?.type === 'FORGOT_PASSWORD') {
    await user.setPassword(req.body.newPassword);
    await user.save();
  }
  res.status(200).json(users.createToken(user.id));
});

router.get('/send-verify-email', async (req, res) => {
  const email = req.query.email?.toString();
  if (!email)
    throw new APIError(400, 'Email not provided');

  if (req.query.type === 'FORGOT_PASSWORD') {
    const user = await users.getByEmail(email);
    await sendEmail.forgotPassword(email, user);

    return res.status(200).json({ verify: true });
  }
  const token = req.get('Authorization');
  const userId = users.idFromAuth(token);
  const user = await users.getSelf(userId);

  await sendEmail.verifyEmail(email, user);

  user.email = email;
  await user.save();

  ws.to(user.id)
    .emit('USER_UPDATE', {
      userId: user.id,
      partialUser: { email: user.email },
    });

  return res.status(200).json({ verify: true });
});

router.get('/verify-email', async (req, res) => {
  const email = verification.getEmailFromCode(req.query.code as string);
  if (!email)
    throw new APIError(400, 'Invalid code');

  await User.updateOne(
    { email },
    { verified: true },
    { runValidators: true, context: 'query' },
  );

  res.redirect(`${process.env.WEBSITE_URL}/channels/@me?success=Successfully verified your email.`);
});

router.post('/change-password', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    verified: true,
  }) as any;
  if (!user)
    throw new APIError(400, 'User Not Found');

  await user.changePassword(req.body.oldPassword, req.body.newPassword);
  await user.save();

  return res.status(200).json(
    users.createToken(user.id)
  );
});

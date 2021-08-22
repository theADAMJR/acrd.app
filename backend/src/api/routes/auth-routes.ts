import { Router } from 'express';
import { SelfUserDocument, User } from '../../data/models/user';
import passport from 'passport';
import Deps from '../../utils/deps';
import Users from '../../data/users';
import { Verification } from '../modules/email/verification';
import { fullyUpdateUser, updateUsername, validateUser } from '../modules/middleware';
import { EmailFunctions } from '../modules/email/email-functions';
import { APIError } from '../modules/api-error';
import { generateInviteCode } from '../../data/models/invite';
import { WebSocket } from '../websocket/websocket';
import { Args } from '../websocket/ws-events/ws-event';

export const router = Router();

const sendEmail = Deps.get<EmailFunctions>(EmailFunctions);
const users = Deps.get<Users>(Users);
const verification = Deps.get<Verification>(Verification);
const ws = Deps.get<WebSocket>(WebSocket);

router.post('/login',
  updateUsername,
  passport.authenticate('local', { failWithError: true }),
  async (req, res) => {
  const user = await users.getByUsername(req.body.username);
  if (!user)
    throw new APIError(400, 'Invalid credentials');  

  if (user.verified) {
    await sendEmail.verifyCode(user as any);
    return res.status(200).json({ verify: true });
  } else if (req.body.email) 
    throw new APIError(400, 'Email is unverified');

  return res.status(200).json(users.createToken(user.id));
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
  const key = req.get('Authorization');
  const user = await users.getSelf(users.idFromAuth(key), false);

  await sendEmail.verifyEmail(email, user);

  user.email = email;
  await user.save();

  ws.to(user.id)
    .emit('USER_UPDATE', { partialUser: { email: user.email } });

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

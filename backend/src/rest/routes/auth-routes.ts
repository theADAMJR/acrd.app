import { Router } from 'express';
import { SelfUserDocument, User } from '../../data/models/user';
import passport from 'passport';
import Deps from '../../utils/deps';
import Users from '../../data/users';
import { Verification } from '../../email/verification';
import { EmailFunctions } from '../../email/email-functions';
import { APIError } from '../modules/api-error';
import patterns from '../../types/patterns';
import { updateUser, validateUser } from '../modules/middleware';

export const router = Router();

const sendEmail = Deps.get<EmailFunctions>(EmailFunctions);
const users = Deps.get<Users>(Users);
const verification = Deps.get<Verification>(Verification);

router.post('/login', (req, res, next) => {
  req['flash'] = (_: string, message: string) => res.status(400).json({ message });
  next();
}, passport.authenticate('local', {
  failWithError: true,
  failureFlash: 'Invalid email or password',
}),
  async (req, res) => {
    const user = await users.getByEmail(req.body.email);
    if (!user)
      throw new APIError(400, 'Invalid credentials');
    else if (user.locked)
      throw new APIError(403, 'This account is locked');
    else if (user.verified) {
      await sendEmail.verifyCode(user as any);
      return res.status(200).json({
        message: 'Check your email for a verification code',
      });
    }
    res.status(201).json({ token: users.createToken(user.id) });
  });

router.post('/register', async (req, res) => {
  const user = await users.create({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  }) as any as SelfUserDocument;

  await sendEmail.verifyEmail(user.email, user);

  res.status(201).json(users.createToken(user.id));
});

router.get('/verify', async (req, res) => {
  const email = verification.getEmailFromCode(req.query.code as string);
  const user = await User.findOne({ email }) as any;  
  if (!email || !user)
    throw new APIError(400, 'Invalid code');

  const code = verification.get(email);
  if (!code)
    throw new APIError(400, 'Invalid code');

  let message: REST.From.Get['/auth/verify']['message'];
  let token: string | undefined = users.createToken(user.id);

  if (code.type === 'FORGOT_PASSWORD') {
    await user.setPassword(code.value);
    await user.save();
    message = 'Password reset';
  } else if (code.type === 'VERIFY_EMAIL') {
    user.email = email;
    await user.save();
    message = 'Email verified';
    token = undefined;
  }

  verification.delete(email);
  res.status(200).json({ message, token } as REST.From.Get['/auth/verify']);
});

router.get('/email/verify-email', updateUser, validateUser, async (req, res) => {
  const user = res.locals.user as SelfUserDocument;
  await sendEmail.verifyEmail(user.email, user);

  res.json({ message: 'Email sent' } as REST.From.Get['/auth/email/verify-email']);
});

router.get('/email/forgot-password', async (req, res) => {
  const email = req.query.email?.toString();
  if (!email)
    throw new APIError(400, 'Email not provided');

  const isValid = patterns.email.test(email);
  if (!isValid)
    throw new APIError(400, 'Email is not in a valid format');

  try {
    const user = await users.getByEmail(email);
    await sendEmail.forgotPassword(email, user);
  } finally {
    return res.status(200).json({ message: 'Email sent' });
  }
});

router.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword }: REST.To.Post['/auth/change-password'] = req.body;

  const user = await User.findOne({ email, verified: true }) as any;
  if (!user)
  throw new APIError(400, 'User Not Found');
  
  await user.changePassword(oldPassword, newPassword);
  await user.save();

  return res.status(200).json({
    message: 'Password changed',
    token: users.createToken(user.id),
  } as REST.From.Post['/auth/change-password']);
});

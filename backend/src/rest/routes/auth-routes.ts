import { Router } from 'express';
import { authenticate } from 'passport';
import { User } from '../../data/user';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export const router = Router();

router.get('/login',
  authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
  const userId = (req.user as Entity.User).id;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY);

  res.json(token);
});

router.get('/register', async (req, res) => {
  const username = req.body.username;
  const usernameCount = await User.countDocuments({ username });

  const maxDiscriminator = 9999;
  if (usernameCount >= maxDiscriminator)
    createError('Username is unavailable');

  const user = await (User as any).register({
    username,
    discriminator: usernameCount + 1,
  }, req.body.password);

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY,
  );
  res.json(token);
});

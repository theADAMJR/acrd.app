import { Router } from 'express';
import { authenticate } from 'passport';
import { User } from '../../data/user';

export const router = Router();

router.get('/login',
  authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
  
});

router.get('/register', async (req, res) => {
  const username = req.body.username;
  const usernameCount = await User.countDocuments({ username });

  const maxDiscriminator = 9999;
  if (usernameCount === maxDiscriminator)
    throw new TypeError('Username is unavailable');

  (User as any).register({
    username,
    discriminator: usernameCount + 1,
  }, req.body.password);
});

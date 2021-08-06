import { Router } from 'express';
import { authenticate } from 'passport';
import { User, UserDocument } from '../../data/models/user';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export const router = Router();

router.post('/login', authenticate('local'), (req, res) => {    
  const user = req.user as UserDocument;
  const userId = user.id;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY);

  if (user.locked)
    createError(401, 'This account is locked');

  res.json(token);
});

router.post('/register', async (req, res) => {
  const username = req.body.username;
  const usernameCount = await User.countDocuments({ username });

  const maxDiscriminator = 9999;
  if (usernameCount >= maxDiscriminator)
    createError('Username is unavailable');

  try {
    const user = await (User as any).register({
      username,
      email: req.body.email,
      discriminator: usernameCount + 1,
    }, req.body.password);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY,
    );
    res.json(token);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

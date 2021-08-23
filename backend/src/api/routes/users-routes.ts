import { Router } from 'express';
import { User } from '../../data/models/user';
import Users from '../../data/users';
import Deps from '../../utils/deps';
import { fullyUpdateUser, updateUser, validateUser } from '../modules/middleware';
import Channels from '../../data/channels';
import { SystemBot } from '../../system/bot';
import { generateInvite } from '../../data/models/invite';

export const router = Router();

const channels = Deps.get<Channels>(Channels);
const users = Deps.get<Users>(Users);

router.get('/', updateUser, validateUser, async (req, res) => {
  const knownUsers = await users.getKnown(res.locals.user.id);  
  res.json(knownUsers);  
});

router.delete('/:id', updateUser, validateUser, async (req, res) => {
  const user = res.locals.user;
  user.username = `deleted-user-${generateInvite(6)}`;
  user.discriminator = 0;
  delete user.salt;
  delete user.hash;
  await user.save();

  res.status(201).json({ message: 'Modified' });
});

router.get('/check-username', async (req, res) => {
  const username = req.query.value?.toString().toLowerCase();
  const exists = await User.exists({
    username: {
      $regex: new RegExp(`^${username}$`, 'i')
    },
  });
  res.json(exists);
});

router.get('/self', fullyUpdateUser, async (req, res) => res.json(res.locals.user));

router.get('/check-email', async (req, res) => {
  const email = req.query.value?.toString().toLowerCase();
  const exists = await User.exists({
    email: {
      $regex: new RegExp(`^${email}$`, 'i')
    },
    verified: true,
  });
  res.json(exists);
});

router.get('/dm-channels', fullyUpdateUser, async (req, res) => {
  const dmChannels = await channels.getDMChannels(res.locals.user.id);
  res.json(dmChannels);
});

router.get('/bots', async (req, res) => {
  const bots = await User.find({ bot: true });
  res.json(bots); 
});

router.get('/:id', async (req, res) => {
  const user = await users.get(req.params.id);
  res.json(user);
});

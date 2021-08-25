import { Router } from 'express';
import { User } from '../../data/models/user';
import Users from '../../data/users';
import Deps from '../../utils/deps';
import { updateUser, validateUser } from '../modules/middleware';
import generateInvite from '../../data/utils/generate-invite';
import { Guild } from '../../data/models/guild';
import { Invite } from '../../data/models/invite';
import { Role } from '../../data/models/role';
import { GuildMember } from '../../data/models/guild-member';
import { Channel } from '../../data/models/channel';

export const router = Router();

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

router.get('/self', updateUser, validateUser, async (req, res) => res.json(res.locals.user));

router.get('/entities', updateUser, validateUser, async (req, res) => {
  const $in = res.locals.user.guildIds;
  
  res.json({
    channels: await Channel.find({ guildId: { $in } }),
    guilds: await Guild.find({ _id: { $in } }),
    members: await GuildMember.find({ guildId: { $in } }),
    roles: await Role.find({ guildId: { $in } }),
    users: await User.find({ guildIds: { $in } }),
  } as REST.Get['/users/entities']);
});

router.get('/:id', async (req, res) => {
  const user = await users.get(req.params.id);
  res.json(user);
});

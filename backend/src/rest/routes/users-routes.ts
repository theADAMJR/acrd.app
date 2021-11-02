import { Router } from 'express';
import { User } from '../../data/models/user';
import Users from '../../data/users';

import generateInvite from '../../data/utils/generate-invite';
import { Guild } from '../../data/models/guild';
import { Role } from '../../data/models/role';
import { GuildMember } from '../../data/models/guild-member';
import { Channel } from '../../data/models/channel';
import updateUser from '../middleware/update-user';
import validateUser from '../middleware/validate-user';
import updateGuild from '../middleware/update-guild';
import validateHasPermission from '../middleware/validate-has-permission';

export const router = Router();

router.get('/', updateUser, validateUser, async (req, res) => {
  const knownUsers = await deps.users.getKnown(res.locals.user.id);
  res.json(knownUsers);
});

router.get('/count', async (req, res) => {
  const count = await User.countDocuments();
  res.json(count);
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
    username: { $regex: new RegExp(`^${username}$`, 'i') },
  });
  res.json(exists);
});

router.get('/check-email', async (req, res) => {
  const email = req.query.value?.toString().toLowerCase();
  const exists = await User.exists({
    email: { $regex: new RegExp(`^${email}$`, 'i') },
    verified: true,
  });
  res.json(exists);
});

router.get('/self', updateUser, validateUser, async (req, res) => res.json(res.locals.user));

router.get('/entities', updateUser, validateUser, async (req, res) => {
  const $in = res.locals.user.guildIds;

  const [channels, guilds, members, roles, unsecureUsers] = await Promise.all([
    Channel.find({ guildId: { $in } }),
    Guild.find({ _id: { $in } }),
    GuildMember.find({ guildId: { $in } }),
    Role.find({ guildId: { $in } }),
    User.find({ guildIds: { $in } }),
  ]);

  const secureUsers = unsecureUsers.map((u: any) => deps.users.secure(u));

  res.json({ channels, guilds, members, roles, users: secureUsers } as REST.From.Get['/users/entities']);
});

router.get('/:id', async (req, res) => {
  const user = await deps.users.get(req.params.id);
  res.json(user);
});

import { Router } from 'express';
import { PermissionTypes } from '@acrd/types';
import { Guild } from '../../data/models/guild';
import updateUser from '../middleware/update-user';
import validateUser from '../middleware/validate-user';
import updateGuild from '../middleware/update-guild';
import validateHasPermission from '../middleware/validate-has-permission';

export const router = Router();

router.get('/', updateUser, validateUser, async (req, res) => {
  const guilds = await Guild.find({ _id: { $in: res.locals.guildIds } });
  res.json(guilds);
});

router.get('/:id', updateUser, validateUser, async (req, res) => {
  const guild = await deps.guilds.get(req.params.id);
  res.json(guild);
});

router.get('/:id/channels',
  updateUser, validateUser, updateGuild,
  validateHasPermission(PermissionTypes.General.VIEW_CHANNELS),
  async (req, res) => {
    const channels = await deps.guilds.getChannels(req.params.id);
    res.json(channels);
});

router.get('/:id/invites',
  updateUser, validateUser, updateGuild,
  validateHasPermission(PermissionTypes.General.MANAGE_GUILD),
  async (req, res) => {
    const invites = await deps.guilds.getInvites(req.params.id);
    res.json(invites);
});

router.get('/:id/members', updateUser, validateUser, updateGuild,
  async (req, res) => {
    const members = await deps.guilds.getMembers(req.params.id);
    res.json(members);
});

router.get('/:id/roles', updateUser, validateUser, updateGuild,
  async (req, res) => {
    const roles = await deps.guilds.getRoles(req.params.id);
    res.json(roles);
});
import { Router } from 'express';
import Deps from '../../utils/deps';
import { updateGuild, updateUser, validateHasPermission, validateUser } from '../modules/middleware';
import Users from '../../data/users';
import Guilds from '../../data/guilds';
import { WebSocket } from '../../ws/websocket';
import GuildMembers from '../../data/guild-members';
import { PermissionTypes } from '../../types/permission-types';
import { WS } from '../../types/ws';
import { Guild } from '../../data/models/guild';

export const router = Router();

const members = Deps.get<GuildMembers>(GuildMembers);
const guilds = Deps.get<Guilds>(Guilds);
const users = Deps.get<Users>(Users);
const ws = Deps.get<WebSocket>(WebSocket);

router.get('/', updateUser, validateUser, async (req, res) => {
  const guilds = await Guild.find({ _id: { $in: res.locals.guildIds } });
  res.json(guilds);
});

router.get('/:id/authorize/:botId',
  updateUser, validateUser, updateGuild,
  validateHasPermission(PermissionTypes.General.MANAGE_GUILD),
  async (req, res) => {
    const guild = res.locals.guild;
    const bot = await users.getSelf(req.params.botId);
    const member = await members.create(guild.id, bot);

    ws.io
      .to(guild.id)
      .emit('GUILD_MEMBER_ADD', { guildId: guild.id, member } as WS.Args.GuildMemberAdd);
    ws.io
      .to(bot.id)
      .emit('GUILD_JOIN', { guild } as WS.Args.GuildCreate);

    res.json({ message: 'Success' });
  });

router.get('/:id/channels',
  updateUser, validateUser, updateGuild,
  validateHasPermission(PermissionTypes.General.VIEW_CHANNELS),
  async (req, res) => {
    const channels = await guilds.getChannels(req.params.id);
    res.json(channels);
});

router.get('/:id/invites',
  updateUser, validateUser, updateGuild,
  validateHasPermission(PermissionTypes.General.MANAGE_GUILD),
  async (req, res) => {
    const invites = await guilds.getInvites(req.params.id);
    res.json(invites);
});

router.get('/:id/members', updateUser, validateUser, updateGuild,
  async (req, res) => {
    const members = await guilds.getMembers(req.params.id);
    res.json(members);
});

router.get('/:id/roles', updateUser, validateUser, updateGuild,
  async (req, res) => {
    const roles = await guilds.getRoles(req.params.id);
    res.json(roles);
});
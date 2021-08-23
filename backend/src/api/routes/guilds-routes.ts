import { Router } from 'express';
import Deps from '../../utils/deps';
import { updateGuild, fullyUpdateUser, validateHasPermission, validateUser } from '../modules/middleware';
import Users from '../../data/users';
import Guilds from '../../data/guilds';
import { WebSocket } from '../websocket/websocket';
import GuildMembers from '../../data/guild-members';
import { PermissionTypes } from '../../types/permission-types';

export const router = Router();

const members = Deps.get<GuildMembers>(GuildMembers);
const guilds = Deps.get<Guilds>(Guilds);
const users = Deps.get<Users>(Users);
const ws = Deps.get<WebSocket>(WebSocket);

router.get('/', fullyUpdateUser, validateUser, async (req, res) => {
  const user = await users.getSelf(res.locals.user.id, true);    
  res.json(user.guilds);
});

router.get('/:id/authorize/:botId',
  fullyUpdateUser, validateUser, updateGuild,
  validateHasPermission(PermissionTypes.General.MANAGE_GUILD),
  async (req, res) => {
  const guild = res.locals.guild;
  const bot = await users.get(req.params.botId);
  const member = await members.create(guild, bot);

  ws.io
    .to(guild.id)
    .emit('GUILD_MEMBER_ADD', { guildId: guild.id, member } as WS.Args.GuildMemberAdd);
  ws.io
    .to(bot.id)
    .emit('GUILD_JOIN', { guild } as WS.Args.GuildJoin);

  res.json({ message: 'Success' });
});

router.get('/:id/invites',
  fullyUpdateUser, validateUser, updateGuild,
  validateHasPermission(PermissionTypes.General.MANAGE_GUILD),
  async (req, res) => {
  const invites = await guilds.invites(req.params.id);
  res.json(invites);
});
import { Router, Request } from "express";
import config from '../../config.json';
import { SavedUser } from "../models/user";
import { SavedGuild } from '../models/guild';
import { SavedMember } from '../models/member';
import Leveling from '../modules/leveling';
import { AuthClient, bot } from '../server';
import { XPCardGenerator } from '../modules/image/xp-card-generator';
import { Guild } from "discord.js";

export const router = Router();

router.get('/:id/public', (req, res) => {
    const guild = bot.guilds.cache.get(req.params.id);
    res.json(guild);
});

router.get('/', async (req, res) => {
    try {
        const guilds = await getManagableGuilds(req.query.key);
        res.json(guilds);
    } catch { res.status(400).send('Bad Request'); }
});

router.put('/:id/:module', async (req, res) => {
    try {
        const isValidModule = config.modules
            .some(m => m.toLowerCase() === req.params.module);
        if (!isValidModule)
            throw new TypeError();
        
        const id = req.params.id;
        validateGuildManager(req.query.key, id);        

        const updatedGuild = await SavedGuild.findById(id);
        updatedGuild[req.params.module] = req.body;       
        await updatedGuild.save();        
        
        res.json(updatedGuild);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/:id/config', async (req, res) => {
    try {
        const id = req.params.id;        
        const savedGuild = await SavedGuild.findById(id).lean();
        res.json(savedGuild);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/:id/channels', async (req, res) => {
    try {
        const guild = bot.guilds.cache.get(req.params.id);
        res.send(guild.channels.cache);        
    } catch { res.status(404).send('Not Found'); }
});

router.get('/:id/roles', async (req, res) => {
    try {
        const guild = bot.guilds.cache.get(req.params.id);
        res.send(guild.roles.cache.filter(r => r.name !== '@everyone'));        
    } catch { res.status(404).send('Not Found'); }
});

router.get('/:id/members', async (req, res) => {
    try {
        const members = await SavedMember.find({ guildId: req.params.id }).lean();
        const guild = await SavedGuild.findById(req.params.id).lean();
        
        let rankedMembers = [];
        for (const savedMember of members) {
            const member = bot.users.cache.get(savedMember._id);
            const xp = Leveling.xpInfo(savedMember.xpMessages, guild.xp.xpPerMessage);
    
            rankedMembers.push({
                id: member.id,
                username: member.username,
                tag: '#' + member.discriminator,
                displayAvatarURL: member.displayAvatarURL(),
                ...xp,
                xpMessages: savedMember.xpMessages
            });
        }
        rankedMembers.sort((a, b) => b.xpMessages - a.xpMessages);
    
        res.json(rankedMembers);
    } catch { res.status(404).send('Not Found'); }
});

async function getManagableGuilds(key: string) {
    let userGuilds = await AuthClient.getGuilds(key);
    
    const guilds = new Map<string, Guild>();
    for (const id of userGuilds.keys()) {
        const authGuild = userGuilds.get(id);
        const hasManager = authGuild._permissions
            .some(p => p === config.dashboard.managerPermission);

        if (!hasManager)
            userGuilds.delete(id);      
    }
    return bot.guilds.cache
        .filter(g => userGuilds.has(g.id));
}

router.get('/:guildId/members/:memberId/xp-card', async (req, res) => {
    try {
        const { guildId, memberId } = req.params;
        
        const savedUser = await getOrCreateSavedUser(memberId);
        if (!savedUser)
            return res.status(404).send("User not found");

        const rank = 1;//Ranks.getUserRank(user, users);
        const generator = new XPCardGenerator(savedUser, rank);
        
        const member = await SavedMember.findOne({ id: memberId, guildId });
        const image = await generator.generate(member);
        
        res.set({'Content-Type': 'image/png'}).send(image);
    }
    catch (error) { res.status(400).send(error); }
});

async function getOrCreateSavedUser(id: string) {
    const user = bot.users.cache.get(id);
    if (!user)
        throw new Error('Invalid user');

    let savedUser = await SavedUser.findById(id);
    if (!savedUser) {
        savedUser = new SavedUser();
        savedUser._id = id;
        savedUser.save();
    }
    return savedUser;
}

async function validateGuildManager(key: string, id: string) {
    const guilds = await getManagableGuilds(key);        
        
    if (!guilds.has(id))
        throw Error();
}
import { Router } from "express";
import config from '../../config.json';
import { SavedUser } from "../models/user";
import { SavedGuild } from '../models/guild';
import { SavedMember } from '../models/member';
import Leveling from '../modules/leveling';
import { AuthClient, bot } from '../server';
import { XPCardGenerator } from '../modules/image/xp-card-generator';

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

router.post('/:id', async (req, res) => {
    try {
        const guilds = await getManagableGuilds(req.query.key);

        const id = req.params.id;
        if (!guilds.has(id))
            throw Error();

        const updatedGuild = await SavedGuild.findByIdAndUpdate(id, req.body).lean();
        
        res.status(200).json(updatedGuild);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/:id/config', async (req, res) => {
    try {
        const guilds = await getManagableGuilds(req.query.key);
        
        const id = req.params.id;
        if (!guilds.has(id))
            throw Error();
        
        const savedGuild = await SavedGuild.findById(id).lean();
        res.json(savedGuild);
    } catch { res.status(400).send('Bad Request'); }
})

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
    
    for (const id of userGuilds.keys()) {
        const guild = userGuilds.get(id);
        const hasManager = guild._permissions
            .some(p => p === config.dashboard.managerPermission);

        if (!hasManager)
            userGuilds.delete(id);
    }
    
    return bot.guilds.cache
        .filter(g => userGuilds.has(g.id));  
}

router.get('/:guildId/members/:memberId/xp-card', async (req, res) => {
    // validateInternalRequest(req, "/user", "/leaderboard/players");

    try 
    {
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
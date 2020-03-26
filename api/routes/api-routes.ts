import { Router } from 'express';
import { SavedCommand, CommandDocument } from '../models/command';
import { AuthClient, bot } from '../server';
import config from '../../config.json';
import { SavedGuild } from '../models/guild';
import { SavedMember } from '../models/member';
import Leveling from '../modules/leveling';
import { XPCardGenerator } from '../modules/image/xp-card-generator';
import { SavedUser } from '../models/user';

export const router = Router();

let commands: CommandDocument[] = [];
SavedCommand.find().then(cmds => commands = cmds);

router.get('/', (req, res) => res.json({ hello: 'earth' }));

router.get('/commands', async (req, res) => res.json(commands));

router.get('/auth', async (req, res) => {
    try {
        const key = await AuthClient.getAccess(req.query.code);
        res.json(key);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/user', async (req, res) => {
    try {
        const user = await getUser(req.query.key);
        res.json(user);
    } catch { res.status(400).send('Bad Request'); }
});

async function getUser(key: string) {
    const { id } = await AuthClient.getUser(key);
    return bot.users.cache.get(id);
}

router.get('/public-guilds/:id', (req, res) => {
    const guild = bot.guilds.cache.get(req.params.id);
    res.json(guild);
});

router.get('/guilds', async (req, res) => {
    try {
        const guilds = await getManagableGuilds(req.query.key);
        res.json(guilds);
    } catch { res.status(400).send('Bad Request'); }
});

router.post('/guilds/:id', async (req, res) => {
    try {
        const guilds = await getManagableGuilds(req.query.key);
        
        const id = req.params.id;
        if (!guilds.has(id))
            throw Error();

        const updatedGuild = await SavedGuild.findByIdAndUpdate(id, req.body).lean();
        
        res.status(200).json(updatedGuild);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/guilds/:id/members', async (req, res) => {
    try {
        const members = await SavedMember.find({ guildId: req.params.id }).lean();
        const guild = await SavedGuild.findById(req.params.id).lean();
        
        let rankedMembers = [];
        for (const savedMember of members) {
            const member = bot.users.cache.get(savedMember._id);
            const xp = Leveling.xpInfo(savedMember.xpMessages, guild.xp.xpPerMessage);
    
            rankedMembers.push({
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

router.get('/guilds/:guildId/members/:memberId/xp-card', async (req, res) => {
    // validateInternalRequest(req, "/user", "/leaderboard/players");

    try 
    {
        SavedUser.create();
        const { guildId, memberId } = req.params;
        console.log(memberId);        
        
        const user = await SavedUser.findById(memberId);
        if (!user)
            return res.status(404).send("User not found");

        const rank = 1;//Ranks.getUserRank(user, users);
        const generator = new XPCardGenerator(user, rank);

        const member = await SavedMember.findOne({ id: memberId, guildId });
        const image = await generator.generate(member);
        
        res.set({'Content-Type': 'image/png'});
        res.send(image);
    }
    catch (error) { res.status(400).send(error); }
});

router.get('*', (req, res) => res.status(404).json({ code: 404 }));

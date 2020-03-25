import { Router } from 'express';
import { SavedCommand, CommandDocument } from '../models/command';
import { AuthClient, bot } from '../server';
import config from '../../config.json';
import { SavedGuild } from '../models/guild';

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

async function getManagableGuilds(key: string) {
    let userGuilds = await AuthClient.getGuilds(key);
    userGuilds.filter(g => g.permissions.some(p => p === config.dashboard.managerPermission))

    return bot.guilds.cache
        .filter(g => userGuilds.has(g.id));  
}

router.get('*', (req, res) => res.status(404).json({ code: 404 }));

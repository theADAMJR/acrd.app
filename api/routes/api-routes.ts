import { Router } from 'express';
import { SavedCommand, CommandDocument } from '../models/command';
import { AuthClient, bot } from '../server';

export const router = Router();

let commands: CommandDocument[] = [];
SavedCommand.find().then(cmds => commands = cmds);

router.get('/', (req, res) => res.json({ hello: 'earth' }));

router.get('/commands', async (req, res) => res.json(commands));

router.get('/auth', async (req, res) => {
    try {
        const code = req.query.code;
        const key = await AuthClient.getAccess(code);
        res.json(key);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/user', async (req, res) => {
    try {
        const key = req.query.key;
        const { id } = await AuthClient.getUser(key);
        const user = bot.users.cache.get(id);
        res.json(user);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/guilds', async (req, res) => {
    try {
        const key = req.query.key;
        const userGuilds = await AuthClient.getGuilds(key);

        const guilds = bot.guilds.cache
            .filter(g => userGuilds.has(g.id));        
        res.json(guilds);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('*', (req, res) => res.status(404).json({ code: 404 }));

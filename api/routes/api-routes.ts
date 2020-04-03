import { Router } from 'express';
import { SavedCommand, CommandDocument } from '../models/command';
import { AuthClient, bot } from '../server';

import { router as guildsRoutes } from './guilds-routes';
import { router as userRoutes } from './user-routes';

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

router.use('/guilds', guildsRoutes);
router.use('/user', userRoutes);

router.get('*', (req, res) => res.status(404).json({ code: 404 }));

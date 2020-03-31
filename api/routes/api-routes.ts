import { Router } from 'express';
import { SavedCommand, CommandDocument } from '../models/command';
import { AuthClient, bot } from '../server';

import { router as guildsRoutes } from './guilds-routes';
import { SavedUser } from '../models/user';
import { XPCardGenerator } from '../modules/image/xp-card-generator';
import { SavedMember } from '../models/member';

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

router.get('/user/saved', async (req, res) => {
    try {        
        const { id } = await getUser(req.query.key);
        const user = await getOrCreateSavedUser(id);
        res.json(user);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/user/xp-card-preview', async (req, res) => {
    try {
        const user = await getUser(req.query.key);
        const savedUser = await getOrCreateSavedUser(user.id);
        if (!savedUser)
            return res.status(404).send("User not found");

        const rank = 1;
        const generator = new XPCardGenerator(savedUser, rank);

        const member = new SavedMember();
        member.xpMessages = 50;
        
        delete req.query.key;        
        const image = await generator.generate(member, req.query);
        
        res.set({'Content-Type': 'image/png'}).send(image);
    } catch { res.status(400).send('Bad Request'); }
});

router.put('/user/xp-card', async (req, res) => {        
    try {
        console.log(req);
        
        const { id } = await getUser(req.query.key);
        const savedUser = await getOrCreateSavedUser(id);

        await savedUser.replaceOne(req.body);
        await savedUser.save();
        
        res.send(savedUser);
    } catch { res.status(400).send('Bad Request'); }
});

async function getUser(key: string) {
    const { id } = await AuthClient.getUser(key);
    return bot.users.cache.get(id);
}

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

router.use('/guilds', guildsRoutes);

router.get('*', (req, res) => res.status(404).json({ code: 404 }));

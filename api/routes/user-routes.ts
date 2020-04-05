import { Router } from "express";
import { XPCardGenerator } from "../modules/image/xp-card-generator";
import { SavedMember } from "../models/member";
import { AuthClient, bot } from "../server";
import { SavedUser } from "../models/user";

export const router = Router();

router.get('/', async (req, res) => {
    try {
        const user = await getUser(req.query.key);
        res.json(user);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/saved', async (req, res) => {
    try {        
        const { id } = await getUser(req.query.key);
        const user = await getOrCreateSavedUser(id);
        res.json(user);
    } catch { res.status(400).send('Bad Request'); }
});

router.get('/xp-card-preview', async (req, res) => {
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

router.put('/xp-card', async (req, res) => {        
    try {
        
        const { id } = await getUser(req.query.key);
        const savedUser = await getOrCreateSavedUser(id);

        savedUser.xpCard = req.body;
        
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
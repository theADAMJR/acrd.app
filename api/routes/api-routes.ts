import { Router } from 'express';
import { SavedCommands } from 'api/models/command';

export const router = Router();

router.get('/', (req, res) => res.json({ hello: 'earth' }));

router.get('/commands', async (req, res) => res.json(await SavedCommands.find()));

router.get('*', (req, res) => res.json({ code: 404 }));

import { Router } from 'express';

export const router = Router();

router.get('/', (req, res) => res.json({ hello: 'earth' }));

router.get('*', (req, res) => res.json({ code: 404 }));

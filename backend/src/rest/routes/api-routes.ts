import { Router } from 'express';

export const router = Router();

router.get('/', (req, res) => res.json({ hello: 'earth' }));

router.post('/error', (req, res) => {
  res.json({ message: 'Received' });
});
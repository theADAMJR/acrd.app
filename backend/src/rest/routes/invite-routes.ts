import { Router } from 'express';

export const router = Router();

router.get('/:id', async (req, res) => {
  const invite = await deps.invites.get(req.params.id);
  res.json(invite);
});

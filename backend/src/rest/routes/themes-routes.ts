import { Entity } from '@accord/types';
import { Router } from 'express';
import { Theme } from '../../data/models/theme';
import { SelfUserDocument } from '../../data/models/user';
import updateUser from '../middleware/update-user';
import validateUser from '../middleware/validate-user';
import { APIError } from '../modules/api-error';

export const router = Router();

router.get('/', async (req, res) => {
  const themes = await Theme.find({ featured: true });
  res.json(themes);
});

router.post('/', updateUser, validateUser, async (req, res) => {
  const theme = await deps.themes.create({
    creatorId: res.locals.user.id,
    name: req.body.name,
    styles: req.body.styles,
  });
  res.status(201).json({ theme });
});

router.get('/:id', async (req, res) => {
  const theme = await deps.themes.get(req.params.id);
  res.json(theme);
});

router.patch('/:id', async (req, res) => {
  const theme = await deps.themes.get(req.params.id);
  if (res.locals.user.id !== theme.creatorId)
    throw new APIError(403, 'You cannot manage this theme');

  await theme.updateOne({
    name: req.body.name,
    styles: req.body.styles,
  }, { runValidators: true });

  res.status(201).json(theme);
});

router.delete('/:id', updateUser, validateUser, async (req, res) => {
  const theme = await deps.themes.get(req.params.id);
  if (res.locals.user.id !== theme.creatorId)
    throw new APIError(403, 'You cannot manage this theme');

  await theme.deleteOne();

  res.status(201).json({ message: 'Deleted' });
});

router.get('/unlock/:id', updateUser, validateUser, async (req, res) => {
  const theme = await deps.themes.get(req.params.id);
  const user: SelfUserDocument = res.locals.user;
  user.unlockedThemeIds.push(theme.id);
  await user.save();

  res.json(user.unlockedThemeIds);
});
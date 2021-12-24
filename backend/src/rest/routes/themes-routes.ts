import { Router } from 'express';
import { Theme } from '../../data/models/theme';
import updateUser from '../middleware/update-user';
import validateUser from '../middleware/validate-user';

export const router = Router();

router.get('/', async (req, res) => {
  const themes = await Theme.find();
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
  await theme.updateOne({
    name: req.body.name,
    styles: req.body.styles,
  }, { runValidators: true });

  res.status(201).json(theme);
});

router.delete('/:id', async (req, res) => {
  const theme = await deps.themes.get(req.params.id);
  await theme.deleteOne();

  res.status(201).json({ message: 'Deleted' });
});
import { Router } from 'express';
import { Theme } from '../../data/models/theme';
import { SelfUserDocument } from '../../data/models/user';
import updateUser from '../middleware/update-user';
import validateUser from '../middleware/validate-user';
import { APIError } from '../modules/api-error';
import parseCSS from 'css-parse';

export const router = Router();

router.get('/', async (req, res) => {
  const themes = await Theme.find({ featured: true });
  res.json(themes);
});

router.post('/', updateUser, validateUser, async (req, res) => {
  const user: SelfUserDocument = res.locals.user;
  const theme = await deps.themes.create({
    code: req.body.code,
    creatorId: user.id,
    name: req.body.name,
    styles: req.body.styles,
  });
  await deps.themes.unlock(theme.id, user);

  res.status(201).json(theme);
});

router.get('/:id', async (req, res) => {
  const theme = await deps.themes.get(req.params.id);
  res.json(theme);
});

router.patch('/:id', updateUser, validateUser, async (req, res) => {
  const { name, styles } = req.body;
  parseCSS(styles);

  const theme = await deps.themes.get(req.params.id);
  if (res.locals.user.id !== theme.creatorId)
    throw new APIError(403, 'You cannot manage this theme');

  await theme.updateOne({ name, styles }, { runValidators: true });

  res.status(201).json(theme);
});

router.delete('/:id', updateUser, validateUser, async (req, res) => {
  const theme = await deps.themes.get(req.params.id);
  if (res.locals.user.id !== theme.creatorId)
    throw new APIError(403, 'You cannot manage this theme');

  await theme.deleteOne();
  await deps.themes.lock(theme.id, res.locals.user);

  res.status(201).json({ message: 'Deleted' });
});

router.get('/:id/unlock', updateUser, validateUser, async (req, res) => {
  const theme = await deps.themes.get(req.params.id);
  const user: SelfUserDocument = res.locals.user;
  await deps.themes.unlock(theme.id, user);

  res.json(user.unlockedThemeIds);
});

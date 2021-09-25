import { Router } from 'express';
import { Application } from '../../data/models/app';
import Users from '../../data/users';
import generateInvite from '../../data/utils/generate-invite';
import Deps from '../../utils/deps';
import { updateUser, validateUser } from '../modules/middleware';
import { WSGuard } from '../../ws/modules/ws-guard';

export const router = Router();

const users = Deps.get<Users>(Users);
const guard = Deps.get<WSGuard>(WSGuard);

router.get('/apps', async (req, res) => {
  const start = parseInt(req.query.start as string);
  const end = parseInt(req.query.end as string);

  const apps = (await Application
    .find()
    .select('-token')
    .exec())
    .slice(start || 0, end || 25);

  res.json(apps);
});

router.use(updateUser, validateUser);

router.get('/apps/user', async (req, res) => {
  const apps = await Application.find({ owner: res.locals.user });
  res.json(apps);
});

router.get('/apps/new', async (req, res) => {  
  const user = res.locals.user;
  const count = await Application.countDocuments({ owner: user });
  const maxApps = 16;
  if (count >= maxApps)
    return res.status(400).json({ message: 'Too many apps' });  

  const app = new Application({ ownerId: user.id });
  app.userId = (await users.create({
    username: app.name,
    password: generateInvite(),
  }, true)).id;
  app.token = users.createToken(user.id, false);
  await app.save();

  res.json(app);
});

router.get('/apps/:id', async (req, res) => {
  const app = await Application.findById(req.params.id);

  return (app?.ownerId !== res.locals.user?.id)
    ? res.status(403).json({ message: 'Forbidden' })
    : res.json(app);
});

router.patch('/apps/:id', async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app || app.ownerId !== res.locals.user.id)
    return res.status(403).json({ message: 'Forbidden' });

  guard.validateKeys('app', req.body);
  await app.update(req.body, { runValidators: true });
  res.json(app);
});

router.get('/apps/:id/regen-token', async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app || app.ownerId !== res.locals.user.id)
    return res.status(403).json({ message: 'Forbidden' });

  app.token = users.createToken(app.userId, false);
  await app.save();

  res.json(app.token);
});
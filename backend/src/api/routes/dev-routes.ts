import { Router } from 'express';
import { Application } from '../../data/models/application';
import { generateInviteCode } from '../../data/models/invite';
import Users from '../../data/users';
import Deps from '../../utils/deps';
import { fullyUpdateUser, validateUser } from '../modules/middleware';
import { WSGuard } from '../modules/ws-guard';

export const router = Router();

const users = Deps.get<Users>(Users);
const guard = Deps.get<WSGuard>(WSGuard);

router.get('/apps', async (req, res) => {
  const start = parseInt(req.query.start as string);
  const end = parseInt(req.query.end as string);

  const apps = (await Application
    .find()
    .select('-token')
    .populate('user')
    .populate('owner')
    .exec())
    .slice(start || 0, end || 25);

  res.json(apps);
});

router.use(fullyUpdateUser, validateUser);

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

  const app = new Application({ owner: user.id as any });
  app.user = (await users.create(app.name, generateInviteCode(), true)).id as any;
  app.token = users.createToken(user.id, false);
  await app.save();

  res.json(app);
});

router.get('/apps/:id', async (req, res) => {
  const app = await Application
    .findById(req.params.id)
    .populate('user')
    .exec();

  return (app?.owner !== res.locals.user?.id)
    ? res.status(403).json({ message: 'Forbidden' })
    : res.json(app);
});

router.patch('/apps/:id', async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app || app.owner !== res.locals.user.id)
    return res.status(403).json({ message: 'Forbidden' });

  guard.validateKeys('app', req.body);
  await app.update(req.body, { runValidators: true });
  res.json(app);
});

router.get('/apps/:id/regen-token', async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app || app.owner !== res.locals.user.id)
    return res.status(403).json({ message: 'Forbidden' });

  app.token = users.createToken(app.user as any, false);
  await app.save();

  res.json(app.token);
});
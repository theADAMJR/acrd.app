import { Router } from 'express';
import { authenticate } from 'passport';
import { User } from '../../data/user';

export const router = Router();

router.get('/login',
  authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
  
});

router.get('/logout', (req, res) => {

});

router.get('/register', (req, res) => {
  User.register({
    username
  }, req.body.password);
});

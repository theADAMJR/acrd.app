import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const loggedIn = (req, res, next) => {
  const payload = jwt.verify(
    req.get('Authorization'),
    process.env.JWT_SECRET_KEY,
  ) as Auth.Payload;
  
  if (!payload.userId)
    createError(401, 'Unauthorized');

  return next();
};
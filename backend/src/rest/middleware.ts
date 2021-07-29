import jwt from 'jsonwebtoken';

export const loggedIn = (req, res, next) => {
  const payload = jwt.verify(
    req.get('Authorization'),
    process.env.JWT_SECRET_KEY,
  ) as Auth.Payload;
  
  return Boolean(payload.userId);
};
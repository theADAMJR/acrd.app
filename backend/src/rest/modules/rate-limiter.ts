import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import RateLimitStore from 'rate-limit-mongo';

const windowMs = 10 * 60 * 1000;

// additional layer rate limits
export const extraRateLimit = (maxRequests: number) => (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'dev') return next();
  
  return rateLimit({
    max: maxRequests,
    message: JSON.stringify({ message: 'You are being rate limited' }),
    store: new RateLimitStore({
      uri: process.env.MONGO_URI,
      collectionName: 'extraRateLimits',
      expireTimeMs: windowMs,
    }),
    windowMs: windowMs / 2,
  })(req, res, next);
}

// default layer rate limits
export default (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'dev') return next();

  return rateLimit({
    max: 5000,
    message: JSON.stringify({ message: 'You are being rate limited' }),
    store: new RateLimitStore({
      uri: process.env.MONGO_URI,
      expireTimeMs: windowMs,
    }),
    windowMs,
  })(req, res, next);
}
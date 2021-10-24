import rateLimit from 'express-rate-limit';
import RateLimitStore from 'rate-limit-mongo';

const windowMs = 10 * 60 * 1000;

// additional layer rate limits
export const extraRateLimit = (maxRequests: number) => rateLimit({
  max: windowMs / 2,
  message: JSON.stringify({ message: 'You are being rate limited' }),
  store: new RateLimitStore({
    uri: process.env.MONGO_URI,
    collectionName: 'extraRateLimits',
    expireTimeMs: windowMs,
  }),
  windowMs,
});

// default layer rate limits
export default rateLimit({
  max: 5000,
  message: JSON.stringify({ message: 'You are being rate limited' }),
  store: new RateLimitStore({
    uri: process.env.MONGO_URI,
    expireTimeMs: windowMs,
  }),
  windowMs,
});
import rateLimit from 'express-rate-limit';
import RateLimitStore from 'rate-limit-mongo';

export default rateLimit({
  max: 10 * 1000,
  message: JSON.stringify({ message: 'You are being rate limited.' }),
  store: new RateLimitStore({ uri: process.env.MONGO_URI }),
  windowMs: 10 * 60 * 1000,
});

import winston from 'winston';
 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.colorize(),
  defaultMeta: {},
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

global.log = logger;
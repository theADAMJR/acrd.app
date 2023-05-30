import { createLogger, format, transports, addColors } from 'winston';

const colorsAndTime = format.combine(
  format.colorize({ level: true }),
  format.timestamp({ format: 'HH:MM:SS' }),
  format.printf(i => `${i.timestamp} ${i.level}: ${i.message}`),
);

addColors({
  info: global.config.logger.info,
  warn: global.config.logger.warn,
  error: global.config.logger.error,
  debug: global.config.logger.debug,
  verbose: global.config.logger.verbose,
  silly: global.config.logger.silly,
});

const logger = createLogger({
  level: 'silly',
  defaultMeta: {},
  transports: [
    new transports.Console({ format: colorsAndTime }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

global['log'] = logger;
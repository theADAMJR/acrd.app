import { createLogger, format, transports, addColors } from 'winston';

const colorsAndTime = format.combine(
  format.colorize({ level: true }),
  format.timestamp({ format: 'HH:MM:SS' }),
  format.printf(i => `${i.timestamp} ${i.level}: ${i.message}`),
);

addColors({
  info: config.log.format.info,
  warn: config.log.format.warn,
  error: config.log.format.error,
  debug: config.log.format.debug,
  verbose: config.log.format.verbose,
  silly: config.log.format.silly,
});

const logger = createLogger({
  level: config.log.level,
  defaultMeta: {},
  transports: [
    new transports.Console({ format: colorsAndTime }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

global['log'] = logger;
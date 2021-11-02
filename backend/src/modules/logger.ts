import { createLogger, format, transports, addColors } from 'winston';

const colorsAndTime = format.combine(
  format.colorize({ level: true }),
  format.timestamp({ format: 'HH:MM:SS' }),
  format.printf(i => `${i.timestamp} ${i.level}: ${i.message}`),
);

addColors({
  info: 'bold blue',
  warn: 'bold yellow',
  error: 'bold red',
  debug: 'bold green',
  verbose: 'bold grey',
  silly: 'bold magenta',
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
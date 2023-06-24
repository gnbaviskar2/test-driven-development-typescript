import fs from 'fs';
import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { serverConfigs } from './configs';

const logDirectory = serverConfigs.LOG_DIR;

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logLevel = serverConfigs.environment === 'development' ? 'debug' : 'warn';

const options = {
  file: {
    level: logLevel,
    filename: `${logDirectory}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: '20m',
    colorize: true,
    maxFiles: '14d',
  },
};

export default createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint()
      ),
    }),
  ],
  exceptionHandlers: [new DailyRotateFile(options.file)],
  exitOnError: false, // do not exit on handled exceptions
});

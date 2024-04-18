import { createLogger, format, transports } from 'winston';
import { ILogger } from '..';

let winstonILoggerImplementation: ILogger | null = null;

const getWinstonILoggerImplementation = (source: string | undefined) => {
  if (!winstonILoggerImplementation) {
    const winstonLogger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.colorize(),
        format.align(),
        format.metadata(),
        format.printf(({ level, message, metadata }) => {
          const { timestamp, source, stack, ...customMetadata } = metadata;
          const stackLog = stack
            ? `\nStack trace: ${stack.replace('at', '\nat')}`
            : '';
          const customMetadataLog =
            Object.keys(customMetadata).length > 0
              ? `\n Custom metadata: ${JSON.stringify(customMetadata, null, 2)}`
              : '';

          return `[${timestamp}][${source}][${level}]: ${message} ${stackLog} ${customMetadataLog}`;
        }),
      ),

      transports: [new transports.Console()],
    });

    winstonILoggerImplementation = {
      info: (message: string, ...meta: unknown[]) =>
        winstonLogger.info(message, ...meta),
      error: (message: string, ...meta: unknown[]) =>
        winstonLogger.error(message, ...meta),
      debug: (message: string, ...meta: unknown[]) =>
        winstonLogger.debug(message, ...meta),
      warn: (message: string, ...meta: unknown[]) =>
        winstonLogger.warn(message, ...meta),
      log: (level: string, message: string, ...meta: unknown[]) =>
        winstonLogger.log(level, message, ...meta),
    };
  }

  if (!winstonILoggerImplementation) {
    throw new Error('Unable to initialize logger');
  }
  const logger: ILogger = winstonILoggerImplementation;

  return {
    info: (message: string, ...meta: unknown[]) =>
      logger.info(message, ...[{ source }, ...meta]),
    error: (message: string, ...meta: unknown[]) =>
      logger.error(message, ...[{ source }, ...meta]),
    debug: (message: string, ...meta: unknown[]) =>
      logger.debug(message, ...[{ source }, ...meta]),
    warn: (message: string, ...meta: unknown[]) =>
      logger.warn(message, { source, ...[{ source }, ...meta] }),
    log: (level: string, message: string, ...meta: unknown[]) =>
      logger.log(level, message, ...[{ source }, ...meta]),
  };

  return logger;
};

export default getWinstonILoggerImplementation;

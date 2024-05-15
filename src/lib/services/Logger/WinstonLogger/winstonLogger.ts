import { createLogger, format, transports } from 'winston';
import { ILogger } from '..';

let winstonLoggerWrapper: ILogger | null = null;

const getWinstonILoggerImplementation = (source: string | undefined) => {
  if (!winstonLoggerWrapper) {
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
          const { timestamp, source, error, ...customMetadata } = metadata;

          const errorWithStackLog = (error as Error)?.stack
            ? `\nError: ${(error as Error)?.stack?.replace('at', '\nat')}`
            : '';

          const errorMessageLog = (error as Error)?.message
            ? `\nError: ${(error as Error).message} `
            : '';

          const customMetadataLog =
            Object.keys(customMetadata).length > 0
              ? `\n\n Custom metadata: ${JSON.stringify(customMetadata, null, 2)}`
              : '';

          return `[${timestamp}][${source}][${level}]: ${message} ${errorWithStackLog || errorMessageLog} ${customMetadataLog}`;
        }),
      ),

      transports: [new transports.Console()],
    });

    winstonLoggerWrapper = {
      info: (message: string, ...meta: unknown[]) =>
        winstonLogger.info(message, ...meta),
      error: (message: string, error?: unknown, ...meta: unknown[]) =>
        winstonLogger.error(message, error, ...meta),
      debug: (message: string, ...meta: unknown[]) =>
        winstonLogger.debug(message, ...meta),
      warn: (message: string, ...meta: unknown[]) =>
        winstonLogger.warn(message, ...meta),
      log: (level: string, message: string, ...meta: unknown[]) =>
        winstonLogger.log(level, message, ...meta),
    };
  }

  const logger: ILogger = winstonLoggerWrapper;

  return {
    info: (message: string, ...meta: unknown[]) =>
      logger.info(message, ...[{ source }, ...meta]),
    error: (message: string, error?: unknown, ...meta: unknown[]) =>
      logger.error(message, ...[{ source, error }, ...meta]),
    debug: (message: string, ...meta: unknown[]) =>
      logger.debug(message, ...[{ source }, ...meta]),
    warn: (message: string, ...meta: unknown[]) =>
      logger.warn(message, ...[{ source }, ...meta]),
    log: (level: string, message: string, ...meta: unknown[]) =>
      logger.log(level, message, ...[{ source }, ...meta]),
  };
};
export default getWinstonILoggerImplementation;

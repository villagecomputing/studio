import { createLogger, format, transports } from 'winston';
import { ILogger } from '..';

const getWinstonILoggerImplementation = (source: string | undefined) => {
  const winstonLogger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
      source,
    },
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

  const logger: ILogger = {
    info: (message: string, ...meta: unknown[]) =>
      winstonLogger.info(message, ...meta),
    error: (message: string, ...meta: unknown[]) =>
      winstonLogger.error(message, ...meta),
    debug: (message: string, ...meta: unknown[]) =>
      winstonLogger.debug(message, ...meta),
    warn: (message: string, ...meta: unknown[]) =>
      winstonLogger.warn(message, ...meta),
    log: (level: string, message: string, ...meta: unknown[]) =>
      winstonLogger.log({ level, message, meta }),
  };

  return logger;
};

export default getWinstonILoggerImplementation;

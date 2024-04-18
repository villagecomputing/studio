import { createLogger, format, transports } from 'winston';

const getLogger = (source: string | undefined) => {
  const logger = createLogger({
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

  return logger;
};

export default getLogger;

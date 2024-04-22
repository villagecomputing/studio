import { guardStringEnum } from '@/lib/typeUtils';
import { LOG_LEVEL } from '..';

const getDefaultILoggerImplementation = (source: string | undefined) => {
  const prefix = source ? `[${source}]` : '';
  const logLevel = guardStringEnum(
    LOG_LEVEL,
    process.env.LOG_LEVEL || LOG_LEVEL.ERROR,
  );
  return {
    error: (message: string, ...meta: unknown[]) => {
      console.error(`${prefix} ${message}`, ...meta);
    },
    warn: (message: string, ...meta: unknown[]) => {
      if (logLevel === LOG_LEVEL.ERROR) {
        return;
      }
      console.warn(`${prefix} ${message}`, ...meta);
    },
    info: (message: string, ...meta: unknown[]) => {
      if (logLevel === LOG_LEVEL.WARN || logLevel === LOG_LEVEL.ERROR) {
        return;
      }
      console.info(`${prefix} ${message}`, ...meta);
    },
    debug: (message: string, ...meta: unknown[]) => {
      if (logLevel !== LOG_LEVEL.DEBUG) {
        return;
      }
      console.debug(`${prefix} ${message}`, ...meta);
    },

    log: (level: string, message: string, ...meta: unknown[]) => {
      const formattedMessage = `${prefix} ${message}`;
      switch (level) {
        case LOG_LEVEL.INFO:
          console.info(formattedMessage, ...meta);
          break;
        case LOG_LEVEL.ERROR:
          console.error(formattedMessage, ...meta);
          break;
        case LOG_LEVEL.DEBUG:
          console.debug(formattedMessage, ...meta);
          break;
        case LOG_LEVEL.WARN:
          console.warn(formattedMessage, ...meta);
          break;
        default:
          console.log(formattedMessage, ...meta);
      }
    },
  };
};

export default getDefaultILoggerImplementation;

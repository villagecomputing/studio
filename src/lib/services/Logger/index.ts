import getDefaultILoggerImplementation from './DefaultLogger/defaultLogger';
import getWinstonILoggerImplementation from './WinstonLogger/winstonLogger';

export enum LOGGER_TYPE {
  WINSTON = 'winston',
  DEFAULT = 'default',
}

export enum LOG_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}
export interface ILogger {
  info: (message: string, ...meta: unknown[]) => void;
  error: (message: string, error?: unknown, ...meta: unknown[]) => void;
  debug: (message: string, ...meta: unknown[]) => void;
  warn: (message: string, ...meta: unknown[]) => void;
  log: (level: string, message: string, ...meta: unknown[]) => void;
}

const getLogger = ({
  type = LOGGER_TYPE.DEFAULT,
  source,
}: { type?: LOGGER_TYPE; source?: string } = {}): ILogger => {
  if (type === LOGGER_TYPE.DEFAULT) {
    return getDefaultILoggerImplementation(source);
  } else {
    return getWinstonILoggerImplementation(source);
  }
};

export default { getLogger };

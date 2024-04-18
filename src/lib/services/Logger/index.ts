import getWinstonILoggerImplementation from './WinstonLogger/winstonLogger';

export interface ILogger {
  info: (message: string, ...meta: unknown[]) => void;
  error: (message: string, ...meta: unknown[]) => void;
  debug: (message: string, ...meta: unknown[]) => void;
  warn: (message: string, ...meta: unknown[]) => void;
  log: (level: string, message: string, ...meta: unknown[]) => void;
}

const getLogger = (source: string | undefined): ILogger => {
  return getWinstonILoggerImplementation(source);
};

export default { getLogger };

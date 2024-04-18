const getDefaultILoggerImplementation = (source: string | undefined) => {
  const prefix = source ? `[${source}]` : '';
  return {
    info: (message: string, ...meta: unknown[]) =>
      console.info(`${prefix} ${message}`, ...meta),
    error: (message: string, ...meta: unknown[]) =>
      console.error(`${prefix} ${message}`, ...meta),
    debug: (message: string, ...meta: unknown[]) =>
      console.debug(`${prefix} ${message}`, ...meta),
    warn: (message: string, ...meta: unknown[]) =>
      console.warn(`${prefix} ${message}`, ...meta),
    log: (level: string, message: string, ...meta: unknown[]) => {
      const formattedMessage = `${prefix} ${message}`;
      switch (level) {
        case 'info':
          console.info(formattedMessage, ...meta);
          break;
        case 'error':
          console.error(formattedMessage, ...meta);
          break;
        case 'debug':
          console.debug(formattedMessage, ...meta);
          break;
        case 'warn':
          console.warn(formattedMessage, ...meta);
          break;
        default:
          console.log(formattedMessage, ...meta);
      }
    },
  };
};

export default getDefaultILoggerImplementation;

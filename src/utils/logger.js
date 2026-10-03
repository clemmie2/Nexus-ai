export const logger = {
  info: (message, meta = {}) => console.info(JSON.stringify({ level: 'info', message, ...meta, at: new Date().toISOString() })),
  warn: (message, meta = {}) => console.warn(JSON.stringify({ level: 'warn', message, ...meta, at: new Date().toISOString() })),
  error: (message, error) => console.error(JSON.stringify({ level: 'error', message, error: error?.stack ?? error?.message, at: new Date().toISOString() }))
};

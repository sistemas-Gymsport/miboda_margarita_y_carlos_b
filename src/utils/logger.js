/* Logger minimo con marca de tiempo. Nunca registrar secretos. */
function format(level, scope, message) {
  return `[${new Date().toISOString()}] ${level.padEnd(5)} [${scope}] ${message}`;
}

const logger = {
  info: (scope, message) => console.log(format('INFO', scope, message)),
  warn: (scope, message) => console.warn(format('WARN', scope, message)),
  error: (scope, message, err) => {
    console.error(format('ERROR', scope, message));
    if (err && err.stack && process.env.NODE_ENV !== 'production') console.error(err.stack);
  },
};

module.exports = logger;

const morgan = require('morgan');
const LoggerStreamAdapter = require('src/infrastructure/logging/LoggerStreamAdapter');

module.exports = ({ logger }) => {
  return morgan('dev', {
    stream: LoggerStreamAdapter.toStream(logger)
  });
};

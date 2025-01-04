const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',  // Set the default logging level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Custom timestamp format
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;  // Custom format for the log
    })
  ),
  transports: [
    new winston.transports.Console()  // Output logs to the console
  ],
});

module.exports = logger;

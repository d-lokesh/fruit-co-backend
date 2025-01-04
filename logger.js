const winston = require('winston');

// Create a custom logging format for colored output
const logger = winston.createLogger({
  level: 'info',  // Set the default logging level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Custom timestamp format
    winston.format.colorize({ all: true, level: true }), // Enable colorization, level-specific colors
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;  // Custom format for the log
    })
  ),
  transports: [
    new winston.transports.Console()  // Output logs to the console
  ],
});

// Define custom levels and colors (e.g., red for error)
winston.addColors({
  error: 'red',
  info: 'green',
  warn: 'yellow',
  debug: 'magenta'
});

module.exports = logger;

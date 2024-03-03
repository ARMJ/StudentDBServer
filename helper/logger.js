const winston = require('winston');
const { createLogger, transports, format } = winston;
const { combine, timestamp, printf } = format;
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

const logDirectory = path.join(__dirname, '../logs');

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  });

// Create a Winston logger instance
const logger = createLogger({
    level: 'info',
    format: combine(
      timestamp(),
      logFormat
    ),
    transports: [
      new DailyRotateFile({
        filename: path.join(logDirectory, 'app-%DATE%.log'),
        datePattern: 'DD-MM-YYYY',
        maxSize: '20m', // Optional: Rotate log files when they reach a certain size
        maxFiles: '14d' // Optional: Retain log files for up to 14 days
      })
    ]
  });

module.exports = logger;
const fs = require('fs');
const path = require('path');
// Create a write stream for logging (append mode)
const logFilePath = path.join(__dirname, '../logs/server.log');

const logRequest = (req) => {
  const now = new Date().toISOString(); // e.g., 2025-06-10T15:30:00.000Z
  const logEntry = `[${now}] ${req.method} ${req.url}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

module.exports={
    logRequest,
}
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const logFilePath = path.join(__dirname, '../logs/server.log');

const logRequest = (req) => {
  const now = new Date().toISOString(); 
  const logEntry = `[${now}] ${req.method} ${req.url}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

const server_req=cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
});


module.exports={
    logRequest,server_req
}
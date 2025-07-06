const fs = require('fs');
const path = require('path');
const cors = require('cors');
require("dotenv").config();

const logFilePath = path.join(__dirname, '../logs/server.log');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logRequest = (req) => {
    const now = new Date().toISOString();
    const logEntry = `[${now}] ${req.method} ${req.url}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });
};

const corsOptions = {
    // Allow multiple origins or use CLIENT_URL consistently
    origin: [
        'https://genapp-one.vercel.app',
        'https://genapp-one-api.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000',
        'https://genapp-one-api.vercel.app/api/user/login'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
};

const server_req = cors(corsOptions);

module.exports = {
    logRequest,
    server_req,
    corsOptions
};

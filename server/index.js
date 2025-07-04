const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
require('dotenv').config();

const connectMongoDB = require('./connections');
const { logRequest, server_req } = require('./middlewares/global');

const urlRouter = require('./routes/url');
const userRouter = require('./routes/user');
const { check_if_logged_in, authorize } = require('./middlewares/auth');

const app = express();
const PORT = 3000;

connectMongoDB(`${process.env.MONGO_DB_URI}/url-shortner-database`)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Apply CORS first
app.use(server_req);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Logging middleware
app.use((req, res, next) => {
    logRequest(req);
    next();
});

// IMPORTANT: Apply CSRF protection BEFORE defining the CSRF token route
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Now define the CSRF token route (after CSRF protection is applied)
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Define other routes
app.use('/api/url', check_if_logged_in, authorize(['user', 'admin']), urlRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
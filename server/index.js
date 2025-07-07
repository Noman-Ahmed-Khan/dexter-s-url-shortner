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

connectMongoDB(`${process.env.MONGODB_URI}`)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.get("/",(req,res)=>{
    res.status(200).send("hello");
});


// Apply CORS FIRST — before everything else!
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

// Apply CSRF protection AFTER CORS
// const csrfProtection = csrf({ cookie: true });
const csrfProtection = csrf({
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    // Remove the domain restriction - it's causing issues
    httpOnly: true,
    // Add maxAge for better reliability
    maxAge: 3600000 // 1 hour
  }
});
app.use(csrfProtection);

// Apply CSRF middleware to all non-GET routes
// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     return next();
//   }
//   return csrfProtection(req, res, next);
// });

// Now define the CSRF token route
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
// Define other routes

app.use('/api/url', check_if_logged_in, authorize(['user', 'admin']), urlRouter);
app.use('/api/user',userRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

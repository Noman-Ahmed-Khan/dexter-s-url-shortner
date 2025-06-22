const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');


require('dotenv').config();


const connectMongoDB = require('./connections');
const { logRequest,server_req } = require('./middlewares/global');

const urlRouter=require('./routes/url')
const userRouter=require('./routes/user');
const { check_if_logged_in } = require('./middlewares/auth');

const app = express();
const PORT = 3000;

connectMongoDB('mongodb://localhost:27017/url-shortner-database')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


app.use(server_req);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next)=>{
    logRequest(req);
    next();
});

app.use('/api/url',check_if_logged_in,urlRouter);
app.use('/api/user',userRouter);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.get('/api/csrf-token', (req, res) => {

    // res.cookie('XSRF-TOKEN', req.csrfToken(), {
    //    httpOnly: false, // So frontend JavaScript can access it
    //     sameSite: 'Lax', // Use 'None' + secure if doing cross-site requests
    //     secure: false,   // Set true if using HTTPS
    // });
  res.json({ csrfToken: req.csrfToken() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

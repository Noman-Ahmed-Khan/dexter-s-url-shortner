const express = require('express');
const connectMongoDB = require('./connections');
const { logRequest } = require('./middlewares/url');
const router=require('./routes/url')

const app = express();
const PORT = 3000;

connectMongoDB('mongodb://localhost:27017/url-shortner-database')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use((req, res, next)=>{
    logRequest(req); // Log every request
    next(); // Call the next middleware or route handler
});

app.use('/url',router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

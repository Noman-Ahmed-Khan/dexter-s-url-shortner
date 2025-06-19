const express = require('express');
const connectMongoDB = require('./connections');
const { logRequest,server_req } = require('./middlewares/url');
const router=require('./routes/url')

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

app.use((req, res, next)=>{
    logRequest(req);
    next();
});

app.use('/api',router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

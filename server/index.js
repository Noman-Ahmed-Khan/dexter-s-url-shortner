const express = require('express');
const connectMongoDB = require('./connections');
const { logRequest,server_req } = require('./middlewares/global');
const urlRouter=require('./routes/url')
const userRouter=require('./routes/user')

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

app.use((req, res, next)=>{
    logRequest(req);
    next();
});

app.use('/api/url',urlRouter);
app.use('/api/user',userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

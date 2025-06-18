const mongoose=require('mongoose')

const connectMongoDB=async (url)=>{
    try{
        const conn=await mongoose.connect(url);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error',error.message);
        process.exit(1);
    }
};

module.exports=connectMongoDB;
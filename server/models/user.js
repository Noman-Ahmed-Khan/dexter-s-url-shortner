const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    job: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    }
}, { timestamps: true });


const UserModel = mongoose.model('UserModel', Schema);

module.exports=UserModel;
// All type of schema and models go here

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    short_id: {
        type: String,
        required: true,
        unique: true
    },
    total_clicks: {
        type: Number,
        default: 0
    },
    timestamp:{
        type: String,
        default: () => new Date().toISOString()
    }
}, { timestamps: true });


const UrlModel = mongoose.model('UrlModel', schema);

module.exports = UrlModel;
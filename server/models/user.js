const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    address: { type: String },
    email: { type: String },
});

module.exports = mongoose.model('User', userSchema);

const { Schema, model } = require('mongoose');

const userSchama = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, required: true, enum: ['created', 'verified'], default: 'created' },
    verificationToken: { type: String, default: '' }
});

module.exports = model('User', userSchama);
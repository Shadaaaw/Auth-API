const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    code:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ["email", "password_reset"],
        required: true
    },
    expiresAt:{
        type: Date,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);
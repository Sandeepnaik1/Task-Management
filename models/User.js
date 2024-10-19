// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema without the email field
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Password hashing before saving user
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

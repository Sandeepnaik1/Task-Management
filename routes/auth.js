// File: routes/auth.js

const express = require('express'); // Import express
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../models/User'); // Import your User model (update path as needed)
const path = require('path'); // Import path to handle file paths

const router = express.Router(); // Create a router instance

// User registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        // Successful login, render task.html
        return res.sendFile(path.join(__dirname, '..', 'views', 'task.html')); // Adjust path if necessary
    } 
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; // Export the router

const express = require('express');
const router = express.Router();
const Task = require('../models/task');


// Create a task
router.post('/', async (req, res) => {
    const { title, description, status, dueDate, category } = req.body;

    // Validate that all required fields are provided
    if (!title || !status) {
        return res.status(400).json({ message: 'Title and status are required.' });
    }

    try {
        const newTask = new Task({
            title,
            description,
            status,
            dueDate,
            user: req.session.userId, // Ensure user ID is taken from the session
            category,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
});

module.exports = router;


// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('user', 'username'); // Populate user info
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});





module.exports = router;

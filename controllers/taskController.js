const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        console.log('Received task data:', req.body); // Log the incoming data

        const task = new Task({ title, description, user: req.session.userId });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error.message); // Log detailed error
        res.status(500).json({ error: 'Error creating task' });
    }
};



exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.session.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
};

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const mongoURI = process.env.MONGODB_URI;

console.log('MongoDB URI:', mongoURI);

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Test Route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/table.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'table.html')); 
});

app.post('/tasks', async (req, res) => {
});

app.get('/tasks', async (req, res) => {
});
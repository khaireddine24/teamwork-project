const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Model/user');
const router = express.Router();
const dotenv = require('dotenv');
const multer = require('multer');
const session = require('express-session'); // Session for managing authentication
const upload = multer({ dest: 'uploads/' });

dotenv.config();

// Middleware for session management
router.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Register route (GET) - Just for API status check
router.get('/register', async (req, res) => {
    res.status(200).json({ message: 'Register endpoint is active' });
});

// Register route (POST)
router.post('/register', upload.single('document'), async (req, res) => {
    const { password1, email, nom, prenom, role } = req.body;
    const document = req.file;  // Uploaded file

    try {
        // Log request body for debugging
        console.log('Request Body:', req.body);

        if (!password1) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password1, 10);

        // Create a new user
        const newUser = new User({
            password: hashedPassword,
            email,
            nom,
            prenom,
            role,
            document: document ? document.filename : null
        });

        // Save the user to the database
        await newUser.save();

        // Respond with JSON success message
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
});


// Login route (GET) - Just for API status check
router.get('/login', async (req, res) => {
    res.status(200).json({ message: 'Login endpoint is active' });
});

// Login route (POST)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;  // Store user ID in session

            // Respond with success message
            res.status(200).json({ message: 'Login successful', userId: user._id });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Logout route (GET)
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
});

// Get all users route (GET)
router.get('/users', async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find();

        // Respond with users in JSON format
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

module.exports = router;
